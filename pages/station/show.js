'use strict';
const xsd = require('../../xsd/index')
const string = require('../../utils/string')

Page({
  data: {
  	station:null,
    current:false,
  },
  onLoad(options){
    const user = xsd.client.auth()
  	wx.showToast({icon:'loading', title:'载入中...'})
    const current = user.profile.station == options.id
  	xsd.api.get('station/'+options.id).then(data=>{
  	  const station = Object.assign({}, data.station)
      station.contacts = (new string.StringArray(station.contacts)).array()
  	  this.setData({station, current})
  	  wx.hideToast()
  	})
  	
  },
})