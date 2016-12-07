"use strict";
const xsd = require('../../xsd/index')

Page({
  data:{
    disabled:true,
  	stations:[],
  	prod:null,
  	agents:[],
  	agent:null,
    quantity:1,
    amount:0.00,    
  },
  onLoad(options){
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
        const agent = (agents.length == 1)?agents[0]:null
	  		this.setData({agents, agent})
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
  		this.setData({agent:this.data.agents[e.currentTarget.dataset.idx]})
      this.caculate()
    }
  },
  caculate(){
    if(!!this.data.agent){
      const amount = (this.data.agent.amount*this.data.quantity).toFixed(2)
      this.setData({amount})
    }
  },
  increate(){
    this.setData({quantity:this.data.quantity+1})
    this.caculate()
  },
  decreate(){
    if(this.data.quantity>1){
      this.setData({quantity:this.data.quantity-1})
      this.caculate()
    }
  },
  quantityChange(e){
    const quantity = xsd.sd.regex.quantity.test(e.detail.value)?e.detail.value:''
    this.setData({quantity})
    this.caculate()
  },
  postOrder(){
    xsd.cart.set(this.data.agent, this.data.quantity)
    wx.showToast({title:'购物篮已更新', icon:'success'})
    wx.navigateBack()
  }  
})