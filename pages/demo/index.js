'use strict';
const util = require('../../utils/util')

Page({
  data:{
  	uuid:'生成UUID'
  },
  test(e){
  	console.log(e.target.dataset.sid)
  },
  cleanStorage(){
	try {
	    wx.clearStorageSync()
	} catch(e) {
	  // Do something when catch error
	}
  },
  createUUID(){
  	this.setData({uuid:util.uuid.createUUID().toLowerCase()})
  }
})
