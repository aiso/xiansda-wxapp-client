//index.js
//获取应用实例
var app = getApp()
var xsd = require("../../xsd/index")
var sync = require('../../utils/sync')
var Promise = require("../../utils/bluebird.min")
const stationsGetter = xsd.sync.stations.getter()

Page({
  data: {
    services:[],
    prods:[]
  },
  onShow(){
    if(!!xsd.auth.check()){
      xsd.sync.base.get().then(data=>{
        this.setData({services:data.services})

        stationsGetter.get().then(stations=>{
          this.loadItems()
        })
      })

    }
  }, 
  loadItems(){
    xsd.api.get('client/items').then(data=>{
      const prods = data.items.map(item=>{
        item.supplier = data.suppliers.find(s=>s.id==item.user).name
        item.service = this.data.services.find(s=>s.id==item.service)
        return item
      })
      this.setData({prods})
    })
  } 
})
