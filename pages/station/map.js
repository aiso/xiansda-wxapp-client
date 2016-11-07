'use strict';
const xsd = require('../../xsd/index')
const util = require('../../utils/util')

Page({
  data: {
  	station:null
  },
  onLoad(options){
  	wx.showToast({icon:'loading', title:'载入中...'})
  	xsd.api.get('station/'+options.id).then(data=>{
  	  const station = data.station
  	  station.location = util.decodeGeohash(station.geohash)
  	  station.markers = [{
	      latitude: station.location.lat,
	      longitude: station.location.lng,
	      name: station.name,
	      desc: station.address
  	  }]
  	  this.setData({station})
  	  wx.hideToast()
  	})
  	
  },
})