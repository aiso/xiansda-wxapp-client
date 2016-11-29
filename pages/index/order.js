"use strict";
const xsd = require('../../xsd/index')

Page({
  data:{
  	prod:null,
  	agent:null,
  	quantity:1,
  	amount:0.00,
  	disabled:false
  },
  onLoad(options){
  	xsd.sync.stations.get().then(stations=>{
	  	xsd.api.get('client/agent/'+options.agent).then(data=>{
	  		const agent = data.agent
	  		agent.station = stations.find(s=>s.id==data.agent.station)
	  		const prod = data.item
	  		prod.amount = parseFloat(prod.price)+parseFloat(agent.fee)
	  		this.setData({prod, agent})
	  		this.caculate()
	  	})
  	})
  },
  caculate(){
  	const amount = (this.data.prod.amount*this.data.quantity).toFixed(2)
  	this.setData({amount})
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
  	const disabled = !xsd.sd.regex.quantity.test(e.detail.value)
  	if(disabled){
  		this.setData({quantity:0, disabled})
  	}else{
  		this.setData({disabled})
  	}
  	this.caculate()
  },
  postOrder(){

  }
})