"use strict";
const xsd = require('../../xsd/index')

Page({
  data:{
    cart:null,
    disabled:true,
  	stations:[],
  	prod:null,
  	agents:[],
    agent:null
  },
  onLoad(options){
    var cart = (!!options.cart)?xsd.cart.get(options.cart):null
    cart = cart || {quantity:1, amount:0}

  	wx.showNavigationBarLoading()
  	xsd.sync.stations.get().then(stations=>{
  		this.setData({stations})
	    return xsd.api.get('item/'+options.id, true)
  	}).then(data=>{
  		this.setData({prod:data.item})
  		const stations = this.data.stations
	  	return xsd.api.get('client/item/'+options.id+'/agents').then(data=>{
	  		const item = this.data.prod
	  		const agents = data.agents.map(agent=>{
	  			agent.station = stations.find(s=>s.id==agent.station)
          agent.amount = parseFloat(item.price)+parseFloat(agent.fee)
	  			return agent
	  		})

        const agent = (!!cart.agent)?agents.find(a=>a.id==cart.agent):((agents.length == 1)?agents[0]:null)
	  		this.setData({agents, agent, cart})
        this.caculate()
	  	})
  	}).finally(()=>{
  		wx.hideNavigationBarLoading()
  	})
  },
  switchAgent(e){
  	if(!!this.data.agent && this.data.agent.id == this.data.agents[e.currentTarget.dataset.idx].id)
  		return;
  	else{
      const agent = this.data.agents[e.currentTarget.dataset.idx]
  		this.setData({agent})
      this.caculate()
    }
  },
  caculate(){
    if(!!this.data.agent){
      this.data.cart.amount = (this.data.agent.amount*this.data.cart.quantity).toFixed(2)
      this.setData({cart:this.data.cart})
    }
  },
  increate(){
    this.data.cart.quantity += 1
    this.setData({cart:this.data.cart})
    this.caculate()
  },
  decreate(){
    if(this.data.cart.quantity>1){
      this.data.cart.quantity -= 1
      this.setData({cart:this.data.cart})
      this.caculate()
    }
  },
  quantityChange(e){
    this.data.cart.quantity = xsd.sd.regex.quantity.test(e.detail.value)?e.detail.value:''
    this.setData({cart:this.data.cart})
    this.caculate()
  },
  postOrder(){
    const old = xsd.cart.items().find(item=>item.agent==this.data.agent.id) || {}
    const cart = Object.assign(old, this.data.cart, {agent:this.data.agent.id})
    xsd.cart.set(cart)

    wx.showToast({title:'购物篮已更新', icon:'success'})
    wx.navigateBack()
  }  
})