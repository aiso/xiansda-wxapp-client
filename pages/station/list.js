'use strict';

var xsd = require("../../xsd/index")

Page({
  data: {
  	stations:null
  },
  onLoad(){
  	wx.showToast({icon:'loading', title:'载入中...'})
  	xsd.api.get('stations').then(data=>{
  	  this.setData({stations:data.stations})
  	  wx.hideToast()
  	}).catch(()=>{
  		wx.hideToast()
  	})
  },
  switchChange(e){
  	const stations = this.data.stations.map((station, index)=>{
  	  station.checked = (index==e.target.dataset.idx)?true:false
  	  return station
  	})
  	this.setData({stations})
  },
  onUnload(){
  	console.log('close')
  }
})