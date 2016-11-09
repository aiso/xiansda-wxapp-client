'use strict';

const xsd = require("../../xsd/index")

Page({
  data: {
  	stations:null,
    setupStationDisabled:true,
    current:0
  },
  onLoad(){
    const current = getApp().getAuth().profile.station||0
  	wx.showToast({icon:'loading', title:'载入中...'})
  	xsd.api.get('stations').then(data=>{
      const stations = data.stations.map(station=>{
        const icon = (station.id == current)?'success':'circle'
        return Object.assign({icon}, station)
      })
  	  this.setData({stations, current})
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
    const setupStationDisabled = (this.data.current == stations[e.target.dataset.idx].id)
  	this.setData({stations, setupStationDisabled})
  },
  setupStation(){
    const station = this.data.stations.find(s=>s.icon=='success')
  	xsd.api.post('client/setup/station', {station:station.id}).then(data=>{
      getApp().globalData.auth.profile.station = station.id
      wx.navigateBack()
    })
  }
})