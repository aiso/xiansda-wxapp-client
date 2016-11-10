'use strict';
const station = require('../../utils/sync').getter('station')

Page({
  data: {
    station:null
  },
  onShow(){
    console.log(this.data.station)

  	station.get().then(station=>{
  		this.setData({station})
  	})
  }
})