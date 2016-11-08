'use strict';
const xsd = require('../../xsd/index')
const string = require('../../utils/string')

Page({
  data: {
  	station:null
  },
  onLoad(options){
  	wx.showToast({icon:'loading', title:'载入中...'})
  	xsd.api.get('station/'+options.id).then(data=>{
  	  const station = Object.assign({}, data.station)
      station.contacts = (new string.StringArray(station.contacts)).array()
  	  this.setData({station})
  	  wx.hideToast()
  	})
  	
  },
})