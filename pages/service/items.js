'use strict';

const xsd = require('../../xsd/index')
const sync = require('../../utils/sync')
const station = sync.getter('station')

const makeupItems = items => {
  return items.map(item=>{
    item.agentAmount = xsd.trans.agentAmount(item.price, 1, item.agent)
    return item
  })
}

Page({
  data: {
    station:null,
  	items:null
  },
  onShow(){

    if(!this.data.station) station.reset()

    station.get().then(station=>{
      this.setData({station})

      wx.showToast({icon:'loading', title:'载入中...'})
      xsd.api.get('client/items', false).then(data=>{
        const items = makeupItems(data.items)
        this.setData({items})
        wx.hideToast()
      })
    })

  }
})