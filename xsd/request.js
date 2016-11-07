'use strict';

const base64 = require('../utils/base64')
const API_PATH = 'http://localhost/xiansda/1/wxapp/'

const _request = opts => {
  return new Promise((resolve, reject) => {
  	const options = Object.assign({
	  method:'GET',
	  success:res=>{
	  	//console.log(res)
	  	if(res.statusCode==200)
	  		resolve(res.data)
	  	else{
	  		const msg = (!!res.data.error)?res.data.error.message:res.data
		    wx.showModal({
		      title: '抱歉，发生错误！',
		      content: msg,
		      showCancel:false,
		      confirmText:'知道了'
		    })
	  		reject(msg)
	  	}
	  },
	  fail:err=>{
	    wx.showModal({
	      title: '抱歉，发生错误！',
	      content: err.errMsg,
	      showCancel:false,
	      confirmText:'知道了'
	    })
	  	reject(err.errMsg)
	  }
	}, opts)

  	const auth = getApp().getAuth()
  	if(!!auth){
  		options.header = {
  			'Authorization': base64.encode(auth.id + ":" + auth.token)
  		}
  	}
	options.url = API_PATH + options.url
	wx.request(options)
  })	
}

const get = url => _request({url, method:'GET'})
const post = (url, data) => _request({url, method:'POST', data})

module.exports = {
  get,
  post
}