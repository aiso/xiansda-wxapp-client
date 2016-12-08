const CART_KEY = "XSD_CART"

const cart = {
	items(){
		try {
		  return (wx.getStorageSync(CART_KEY)||[]).sort((a,b)=>(a.id-b.id))
		} catch (e) {
			console.log(e)
		}
	},
	get(id){
		return this.items().find(item=>item.id==id)
	},
	set(cart){
		const items = this.items()
		const item = (!!cart.id)?items.find(i=>i.id==cart.id):null
		if(!!item){
			Object.assign(item, cart)
		}else{
			cart.id = new Date().getTime()
			items.push(cart)
		}

		try {
		    wx.setStorageSync(CART_KEY, items)
		} catch (e) {   
			 console.log(e)
		}
	},
	remove(id){
		const items = this.items().filter(i=>i.id!=id)
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