"use strict";
const xsd = require('../../xsd/index')

Page({
  data:{
  	items:[],
  	amount:0.00,
  	disabled:true
  },
  onShow(){
  	this.loadCart()
  },
  loadCart(){
  	const items = xsd.cart.items()
  	if(items.length > 0){
  		xsd.sync.stations.get().then(stations=>{
		  	const ids = items.map(i=>i.id)
		  	xsd.api.get('client/agents/'+ids.join(',')).then(data=>{
		  		const agents = data.agents.map(agent=>{
		  			agent.quantity = items.find(i=>i.id=agent.id).quantity
		  			agent.station = stations.find(s=>s.id==agent.station)
		  			agent.selected = false
		  			return agent
		  		})
		  		this.setData({items:agents})
		  	})
  		})
  	}
  },
  switchItem(e){
  	console.log(e.currentTarget.dataset.item)
  	const items = this.data.items.map(item=>{
  		if(item.id == e.currentTarget.dataset.item)
  			item.selected = !item.selected
  		return item
  	})
  	console.log(items)
  	this.setData({items})
  	this.caculate()
  },
  caculate(){
  	var amount = 0.00
  	this.data.items.forEach(agent=>{
  		amount += (parseFloat(agent.fee) + parseFloat(agent.item.price))*agent.quantity
  	})
  	this.setData({amount:amount.toFixed(2), disabled:amount<=0})
  },
  itemOptions(e){
	wx.showActionSheet({
	  itemList: ['查看', '修改', '删除'],
	  success: res => {
	    if (!res.cancel) {
	    	const agent = this.data.items[e.currentTarget.dataset.idx]
	    	console.log(agent)
	    	if(res.tapIndex == 0)
	    		wx.navigateTo({url:'../index/item?id='+agent.item.id})
	    	else if(res.tapIndex == 1)
	    		wx.navigateTo({url:'order?agent='+agent.id})
	      	else if(res.tapIndex == 2){

	      	}
	    }
	  }
	})
  }

})