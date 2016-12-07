"use strict";
const xsd = require('../../xsd/index')

Page({
  data:{
  	stations:[],
  	prod:null,
  	agents:[],
  	agent:null
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
	  		this.setData({agents})
	  	})
  	}).finally(()=>{
  		wx.hideNavigationBarLoading()
  	})
  },
  switchAgent(e){
  	if(!!this.data.agent && this.data.agent.id == this.data.agents[e.currentTarget.dataset.idx].id)
  		return;
  	else
  		this.setData({agent:this.data.agents[e.currentTarget.dataset.idx]})
  }
})