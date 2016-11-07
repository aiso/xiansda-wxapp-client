'use strict';

const xsd = require("../../xsd/index")

Page({
  data: {
  	stations:null,
    setupStationDisabled:true
  },
  onLoad(){
  	wx.showToast({icon:'loading', title:'载入中...'})
  	xsd.api.get('stations').then(data=>{
      const stations = data.stations.map(station=>{
        return Object.assign({icon:'circle'}, station)
      })
  	  this.setData({stations})
  	  wx.hideToast()
  	}).catch(()=>{
  		wx.hideToast()
  	})
  },
  switchChange(e){
  	const stations = this.data.stations.map((station, index)=>{
  	  station.icon = (index==e.target.dataset.idx)?'success':'circle'
  	  return station
  	})
  	this.setData({stations, setupStationDisabled:false})
  },
  setupStation(){
    const station = this.data.stations.find(s=>s.icon=='success')
  	xsd.api.post('client/setup/station', {station:station.id}).then(data=>{
      getApp().globalData.auth.profile.station = station.id
      wx.navigateBack()
    })
  }
})