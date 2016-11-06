//app.js
const xsd = require('xsd/index')

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              //console.log(res.userInfo)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })

          xsd.api.post('client/login', {code:'client-test'}).then(data=>{
            console.log(data)
            that.globalData.auth = data.user
          })
        }
      })
    }
  },
  getAuth(){
    const user = this.globalData.auth
    if(!!user && !!user.last_access && user.expire){
        var timeStr = user.last_access.split(/[\s:-]/),
            loginTime = new Date(timeStr[0], timeStr[1]-1, timeStr[2], timeStr[3], timeStr[4], timeStr[5]),
            currTime = new Date();
        if(currTime.getTime() - loginTime.getTime() > user.expire*1000){
            this.globalData.auth = null
            return null;
        }else
          return user
    }else
      return null
  },
  globalData:{
    userInfo:null,
    auth:null
  }
})