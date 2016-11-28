"use strict";
const xsd = require('../../xsd/index')

Page({
  data:{
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

  	prod:null,
  },
  onLoad(options){
  	xsd.sync.stations.get().then(stations=>{
	  	xsd.api.get('client/item/'+options.id).then(data=>{
	  		const prod = data.item
	  		prod.agents = data.agents.map(agent=>{
	  			agent.station = stations.find(s=>s.id==agent.station)
	  			return agent
	  		})
	  		this.setData({prod})
	  	})
  	})


  },
})