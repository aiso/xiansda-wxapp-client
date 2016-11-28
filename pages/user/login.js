//index.js
//获取应用实例
var app = getApp()
var xsd = require("../../xsd/index")
var sync = require('../../utils/sync')
var Promise = require("../../utils/bluebird.min")

Page({
  data: {
    access:false,
    retry:false,
    welcome: '正在登录鲜时达...',
    userInfo: {},
  },
  onShow: function () {
    console.log('onLoad')
    this.login()
  },
  login(){
    this.setData({
      welcome: '正在登录鲜时达...',
      retry:false
    })

    wx.showNavigationBarLoading()

    app.getUserInfo().then(userInfo=>{
      this.setData({userInfo})
      return {userInfo, accessCode:app.globalData.accessCode}
    }).then(params=>{
      const postData = {code: params.accessCode, userInfo:params.userInfo}
      !!getApp().globalData.debugUser && (postData.code = getApp().globalData.debugUser) //是否调试用户
      return xsd.api.post('client/login', postData).then(data=>{
        if(!!data.user){
          this.setData({
            welcome:'登录成功...'
          })
          xsd.client.login(data)
        }else{
          this.setData({
            access:true,
            retry:false,
            welcome:'无效用户'
          })
        }

      })

    }).catch(err=>{
      this.setData({
        welcome:err,
        retry:true
      })
    }).finally(()=>{
      wx.hideNavigationBarLoading()
    })
  },
  back(){
    wx.navigateBack()
  }  
})
