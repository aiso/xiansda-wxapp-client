const CART_KEY = "XSD_CART"

const cart = {
	items(){
		try {
		  return wx.getStorageSync(CART_KEY)||[]
		} catch (e) {
			console.log(e)
		}
	},
	get(agent){
		return this.items().find(i=>i.id==agent.id)
	},
	set(agent, quantity){
		const items = this.items()
		const item = items.find(i=>i.id==agent.id)
		if(!!item){
			item.quantity = quantity
		}else{
			const item = Object.assign(agent, {quantity})
			items.push(item)
		}

		try {
		    wx.setStorageSync(CART_KEY, items)
		} catch (e) {   
			 console.log(e)
		}
	},
	remove(agent){
		const items = this.items().filter(i=>i.id!=agent.id)
		try {
		    wx.setStorageSync(CART_KEY, items)
		} catch (e) {   
			 console.log(e)
		}
	},
	clean(){
		try {
		  wx.removeStorageSync(CART_KEY)
		} catch (e) {
		  console.log(e)
		}
	}
}

module.exports = cart