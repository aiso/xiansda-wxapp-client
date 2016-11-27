"user strict"
const xsd = require("../../xsd/index")
const sgStations = xsd.sync.stations.getter()

Page({
  data:{
  	userInfo:null,
  	stations:[]
  },
  onLoad(){
  	const user = xsd.client.auth()
  	const userInfo = getApp().globalData.userInfo
  	this.setData({userInfo})
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