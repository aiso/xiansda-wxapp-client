'use strict';

const xsd = require('../../xsd/index')

Page({
  data: {
  	station:null,
  	items:null
  },
  onLoad(){
	wx.showToast({icon:'loading', title:'载入中...'})
	xsd.client.station().then(data=>{
		this.setData({station:data.station})
	}).then(()=>{
		xsd.api.get('client/items', false).then(data=>{
		  const items = data.items
		  this.setData({items})
		  wx.hideToast()
		})
	})
  }

})