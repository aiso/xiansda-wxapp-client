'use strict';
const xsd = require('../../xsd/index')
const util = require('../../utils/util')

Page({
  data: {
  	station:null
  },
  onLoad(options){

    xsd.sync.stations.get().then(stations=>{
      var station = stations.find(s=>s.id==options.id)
      if(!!station)
        this.setStation(station)
      else{
          wx.showToast({icon:'loading', title:'载入中...'})
          xsd.api.get('station/'+options.id).then(data=>{
            this.setStation(data.station)
          }).finally(()=>{
            wx.hideToast()
          })
      }

    })
  },
  setStation(s){
    console.log(s)
    const location = util.decodeGeohash(s.geohash)
    const station = Object.assign({
      location,
      markers:[{
        latitude: location.lat,
        longitude: location.lng,
        name: s.name,
        desc: s.address
      }]
    }, s)
    this.setData({station})
  }
})