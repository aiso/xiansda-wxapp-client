"use strict";
const xsd = require("../../xsd/index")

Page({
  data:{
  	stations:[],
  	userStations:[]
  },
  onLoad(){
    const user = xsd.client.auth()
    wx.showToast({icon:'loading', title:'载入中...'})
    xsd.sync.stations.get().then(stations=>{
      const userStations = stations.map(s=>s.id)
      this.setData({userStations})
      return userStations
    }).then(userStations=>{
      xsd.api.get('stations', true).then(data=>{
        const stations = data.stations.map(station=>{
          const checked = !!userStations.find(s=>s==station.id)
          return Object.assign(station, {checked})
        })
        this.setData({stations})
      })
    }).finally(()=>{
      wx.hideToast()
    })
  },
  switchStation(e){
    var userStations = this.data.userStations
    if(e.detail.value){
      userStations.push(e.target.dataset.station)
      userStations = Array.from(new Set(userStations))
    }else{
      userStations = userStations.filter(station=>station!=e.target.dataset.station)
    }
    this.setData({userStations})
  },
  setupStations(){
    wx.showToast({icon:'loading', title:'处理中...'})
    const stations = this.data.userStations
    xsd.api.post('client/stations', {stations:this.data.userStations.join(',')}).then(data=>{
      xsd.sync.stations.set(data.stations)
      wx.navigateBack()
    }).finally(()=>{
      wx.hideToast()
    })
  }
})