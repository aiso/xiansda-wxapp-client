//index.js
//获取应用实例
var app = getApp()
var xsd = require("../../xsd/index")
var sync = require('../../utils/sync')
var Promise = require("../../utils/bluebird.min")
const stationsGetter = xsd.sync.stations.getter()

Page({
  data: {
    prods:[]
  },
  onLoad: function () {
    xsd.client.auth()
  },
  onShow(){
    stationsGetter.get().then(stations=>{
      xsd.api.get('client/items').then(data=>{
        this.setData({prods:data.items})
      })
    })
  },  
})
