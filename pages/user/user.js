'use strict';
var xsd = require("../../xsd/index")
const app = getApp()

Page({
  data: {
  	user:null,
  	station:null,
  },
  onLoad(){
  	const user = app.getAuth()
  	xsd.client.station().then(data=>{
  		this.setData({user, station:data.station})
  	})
  }
})