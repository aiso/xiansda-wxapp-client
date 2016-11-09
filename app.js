//app.js
const xsd = require('xsd/index')

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  login(){
    if(!!this.globalData.accessCode) 
      return Promise.resolve(this.globalData.accessCode)

    const that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res)=>{
          that.globalData.accessCode = res.code
          resolve(res.code)
        }
      })
    })
  },
  getUserInfo(){
    if(!!this.globalData.userInfo) 
      return Promise.resolve(this.globalData.userInfo)

    const that = this
    return new Promise((resolve, reject) => {
      that.login().then(()=>{
        wx.getUserInfo({
          success: function (res) {
            //console.log(res.userInfo)
            that.globalData.userInfo = res.userInfo
            resolve(res.userInfo)
          }
        })
      })
    })
  },
  loginXsd(accessCode, userinfo){
    const code = 'client-test' // 测试用
    return xsd.api.post('client/login', {code, userinfo}).then(data=>{
      this.globalData.auth = data.user
      return data.user
    })
  },
  getAuth(){
    var user = this.globalData.auth
    if(!!user && !!user.last_access && user.expire){
        var timeStr = user.last_access.split(/[\s:-]/),
            loginTime = new Date(timeStr[0], timeStr[1]-1, timeStr[2], timeStr[3], timeStr[4], timeStr[5]),
            currTime = new Date();
        if(currTime.getTime() - loginTime.getTime() > user.expire*1000){
            this.globalData.auth = null
            user = null;
        }
    }

    if(!!user)
      return user
    else{
      wx.navigateTo({url:'/pages/index/index'})
      return null
    }
  },
  globalData:{
    accessCode:null,
    userInfo:null,
    auth:null
  }
})