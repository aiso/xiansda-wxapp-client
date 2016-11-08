//index.js
//获取应用实例
'use strict';

var app = getApp()
var xsd = require("../../xsd/index")

Page({
  data: {
    retry:false,
    welcome: '正在登录鲜时达...',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    /*
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })*/
    this.login()
  },
  login(){
    app.getUserInfo().then(userInfo=>{
      this.setData({userInfo})
      console.log(app.globalData)
      return {userInfo, accessCode:app.globalData.accessCode}
    }).then(params=>{
      console.log(params)
      return app.loginXsd(params.accessCode, params.userInfo)
    }).then(()=>{
      console.log(app.globalData)
      this.setData({
        retry:true,
        welcome:'登录成功'
      })
      if(!app.globalData.auth.profile.station)
        wx.navigateTo({url:'../station/list'})
      else
        wx.navigateTo({url:'../service/items'})
      return true
    }).catch(err=>{
      this.setData({
        retry:true,
        welcome:err
      })
    })
  },
  testApi(){
    /*
    xsd.api.get('test').then(data=>{
      console.log(data)
    })*/
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      showCancel:false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
    //console.log(app.globalData)
  }
})
