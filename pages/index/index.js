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
  onShow(){
    !!xsd.auth.check() && stationsGetter.get().then(stations=>{
      this.loadItems()
    })
  }, 
  loadItems(){
    xsd.api.get('client/items').then(data=>{
      const prods = data.items.map(item=>{
        item.supplier = data.suppliers.find(s=>s.id==item.user).name
        return item
      })
      this.setData({prods})
    })
  } 
})
