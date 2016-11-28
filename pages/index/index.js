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
    console.log('index load')
    xsd.client.auth()
  },
  onShow(){
    console.log('index show')
    stationsGetter.get().then(stations=>{
      xsd.api.get('client/items').then(data=>{
        const prods = data.items.map(item=>{
          item.supplier = data.suppliers.find(s=>s.id==item.user).name
          return item
        })
        this.setData({prods})
      })
    })
  },  
})
