'use strict';

const xsd = require('../../xsd/index')
const station = require('../../utils/sync').getter('station')

Page({
  data: {
  	items:null
  },
  onShow(){
  	console.log('onshow')
  	xsd.client.auth()
  	station.get().then(()=>{
  		wx.showToast({icon:'loading', title:'载入中...'})
		xsd.api.get('client/items', false).then(data=>{
		  const items = data.items
		  this.setData({items})
		  wx.hideToast()
		})
  	})
  },
})