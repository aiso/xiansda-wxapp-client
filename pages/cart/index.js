"use strict";
const xsd = require('../../xsd/index')

Page({
  data:{
  	items:[],
  	amount:0.00,
  	disabled:true,
    allSelected:false
  },
  onShow(){
  	this.loadCart()
  },
  loadCart(){
  	const items = xsd.cart.items()
  	if(items.length > 0){
  		xsd.sync.stations.get().then(stations=>{

		  	const ids = items.map(i=>i.id)
		  	xsd.api.get('client/agents/'+ids.join(','), true).then(data=>{
		  		const agents = data.agents.map(agent=>{
            const item = Object.assign({}, agent, {
              amount: (parseFloat(agent.fee) + parseFloat(agent.item.price)).toFixed(2),
              quantity:items.find(i=>i.id==agent.id).quantity,
              station:stations.find(s=>s.id==agent.station)
            })
            const prevState = this.data.items.find(i=>i.id==agent.id)
		  			item.selected = !!prevState?prevState.selected:false
		  			return item
		  		})
		  		this.setData({items:agents})
          this.caculate()
		  	})
  		})
  	}
  },
  switchItem(e){
  	const items = this.data.items.map(item=>{
  		if(item.id == e.currentTarget.dataset.item)
  			item.selected = !item.selected
  		return item
  	})
  	this.setData({items})
  	this.caculate()
  },
  switchAll(){
    const allSelected = !this.data.allSelected
    const items = this.data.items.map(item=>{
      item.selected = allSelected
      return item
    })
    this.setData({items})
    this.caculate()
  },
  caculate(){
  	var amount = 0.00
    var allSelected = true
  	this.data.items.forEach(agent=>{
      if(agent.selected)
  		  amount += agent.amount*agent.quantity
      allSelected &= agent.selected
  	})
  	this.setData({amount:amount.toFixed(2), disabled:amount<=0, allSelected})
  },
  itemOptions(e){
  	wx.showActionSheet({
  	  itemList: ['查看', '修改', '删除'],
  	  success: res => {
  	    if (!res.cancel) {
  	    	const agent = this.data.items[e.currentTarget.dataset.idx]
  	    	if(res.tapIndex == 0)
  	    		wx.navigateTo({url:'../index/item?id='+agent.item.id})
  	    	else if(res.tapIndex == 1)
  	    		wx.navigateTo({url:'order?agent='+agent.id})
        	else if(res.tapIndex == 2){
            wx.showModal({title:'确定删除该商品?', confirmText:'确定', success: res=>{
               if (res.confirm) {
                const agent = this.data.items[e.currentTarget.dataset.idx]
                xsd.cart.remove(agent)
                const items = this.data.items.filter(i=>i.id!=agent.id)
                this.setData({items})
                this.caculate()
               }
            }})
        	}
  	    }
  	  }
  	})
  },
  checkout(){
    const postItems = this.data.items.filter(i=>i.selected==true).map(item=>{
      return {
        agent:item.id,
        station:item.station.id,
        item:item.item.id,
        price:item.item.price,
        fee:item.fee,
        strategy:item.strategy,
        quantity:item.quantity
      }
    })
    xsd.api.post("client/cart", {items:postItems}).then(data=>{
      console.log(data);
    })

  }
})