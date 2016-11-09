'use strict';
const xsd = require("../../xsd/index")
const station = require('../../utils/sync').getter('station')

Page({
  data: {
  	user:null,
    station:null
  },
  onShow(){
  	const user = xsd.client.auth()
  	station.get().then(station=>{
  		this.setData({user, station})
  	})
  }
})