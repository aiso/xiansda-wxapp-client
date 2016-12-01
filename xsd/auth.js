'use strict';

const Promise = require("../utils/bluebird.min")
const api = require('request.js')
const sync = require('../utils/sync')

const AUTH_KEY = 'XSD_AUTH_KEY'

const load = () => {
	try {
	    user = wx.getStorageSync(AUTH_KEY)

	} catch (e) {   
		console.log(e)
	}
}

const login = () => {
	wx.showNavigationBarLoading()
    wx.showToast({title:'登录中...', icon:'loading'})

    app.getUserInfo().then(userInfo=>{
      const postData = {code: app.globalData.accessCode, userInfo}
      !!getApp().globalData.debugUser && (postData.code = getApp().globalData.debugUser) //是否调试用户
      return api.post('client/login', postData).then(data=>{
      	return new Promise((resolve, reject)=>{
	        if(!!data.user){
				try {
				    wx.setStorageSync(AUTH_KEY, data.user)
				    resolve(data.user)
				} catch (e) {   
					reject(e)
				}
	        }else{
	        	reject('无效用户')
	        }
      	})
      })

    }).catch(err=>{
    	wx.showModal({title:'登录失败！', content:err})
    }).finally(()=>{
      wx.hideNavigationBarLoading()
    })


	sync.setEntity('auth', data.user)
	sync.setEntity('stations', data.init.stations)

}

const get = () => {
	return new Promise((resolve, reject)=>{
		wx.getStorage({key:AUTH_KEY, success:(res)=>{


		}})
	})


	const auth = sync.getEntityData('auth')
	if(!!auth){
	    var timeStr = auth.last_access.split(/[\s:-]/),
	        loginTime = new Date(timeStr[0], timeStr[1]-1, timeStr[2], timeStr[3], timeStr[4], timeStr[5]),
	        currTime = new Date();
	    if(currTime.getTime() - loginTime.getTime() > auth.expire*1000){
	    	sync.setEntity('auth', null)
	    	wx.navigateTo({url:'/pages/user/login'})
	    }else
	    	return auth
	}else
		wx.navigateTo({url:'/pages/user/login'})
}

module.exports = {
	login,
	get
}