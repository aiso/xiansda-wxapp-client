"user strict"
const xsd = require("../../xsd/index")
const sgStations = xsd.sync.stations.getter()

Page({
  data:{
  	userInfo:null,
  	stations:[]
  },
  onLoad(){
  	this.setData({userInfo:getApp().globalData.user.wxinfo})
  },
  onShow(){
    sgStations.get().then(stations=>{
      this.setData({stations})
    })
  },
  test(e){
  	console.log(e.target.dataset.sid)
  }
})