'use strict';

const api = require('request.js')
const AUTH_KEY = 'XSD_AUTH_KEY'

const login = () => {
	wx.showNavigationBarLoading()
    wx.showToast({title:'登录中...', icon:'loading'})

    app.getUserInfo().then(userInfo=>{
      const postData = {code: app.globalData.accessCode, userInfo}
      !!getApp().globalData.debugUser && (postData.code = getApp().globalData.debugUser) //是否调试用户
      return api.post('client/login', postData).then(data=>{
        if(!!data.user){
			try {
			    wx.setStorageSync(AUTH_KEY, data.user)
			} catch (e) {   
				 console.log(e)
			}
        }else{
        	wx.showModal({title:'登录失败！', content:'无效用户'})
        }

      })

    }).catch(err=>{
    	wx.showModal({title:'登录失败！', content:err})
    }).finally(()=>{
      wx.hideNavigationBarLoading()
    })


	sync.setEntity('auth', data.user)
	sync.setEntity('stations', data.init.stations)
	setTimeout(function() {
	  wx.navigateBack()
	}, 500);
}

const get = () => {
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