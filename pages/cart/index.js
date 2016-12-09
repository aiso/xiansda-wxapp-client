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

		  	const ids = items.map(i=>i.agent)
		  	xsd.api.get('client/agents/'+ids.join(','), true).then(data=>{
		  		const carts = data.agents.map(agent=>{
            agent.amount = (parseFloat(agent.fee) + parseFloat(agent.item.price)).toFixed(2)
            const cart = items.find(i=>i.agent==agent.id)
            const item = Object.assign(cart, {
              agent,
              amount: (agent.amount*cart.quantity).toFixed(2),
              station:stations.find(s=>s.id==agent.station)
            })
            const prevState = this.data.items.find(i=>i.id==cart.id)
		  			item.selected = !!prevState?prevState.selected:false
		  			return item
		  		})
		  		this.setData({items:carts})
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
  	this.data.items.forEach(item=>{
      if(item.selected)
  		  amount += item.agent.amount*item.quantity
      allSelected &= item.selected
  	})
  	this.setData({amount:amount.toFixed(2), disabled:amount<=0, allSelected})
  },
  itemOptions(e){
  	wx.showActionSheet({
  	  itemList: ['查看商品', '修改订单', '删除订单'],
  	  success: res => {
  	    if (!res.cancel) {
  	    	const cart = this.data.items[e.currentTarget.dataset.idx]
  	    	if(res.tapIndex == 0)
  	    		wx.navigateTo({url:'../index/item?id='+cart.agent.item.id})
  	    	else if(res.tapIndex == 1)
  	    		wx.navigateTo({url:'../s' + cart.agent.item.service + '/order?id='+cart.agent.item.id+'&cart='+cart.id})
        	else if(res.tapIndex == 2){
            wx.showModal({title:'确定删除该商品?', confirmText:'确定', success: res=>{
               if (res.confirm) {
                const cart = this.data.items[e.currentTarget.dataset.idx]
                xsd.cart.remove(cart.id)
                const items = this.data.items.filter(i=>i.id!=cart.id)
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
        agent:item.agent.id,
        price:item.agent.item.price,
        fee:item.agent.fee,
        strategy:item.agent.strategy,
        quantity:item.quantity
      }
    })

    xsd.api.post("client/cart", {items:postItems}).then(data=>{
      console.log(data);
    })

  }
})