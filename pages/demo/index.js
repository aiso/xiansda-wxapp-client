'use strict';

Page({
  test(e){
  	console.log(e.target.dataset.sid)
  },
  cleanStorage(){
	try {
	    wx.clearStorageSync()
	} catch(e) {
	  // Do something when catch error
	}
  }
})
