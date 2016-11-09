
function SyncEntity(name){
	this.name = name
}
SyncEntity.prototype.set = function(data, expire){
	this.data = data
	this.expire = expire
	this.timestampe = (new Date()).getTime()
}
SyncEntity.prototype.get = function(timestampe){
	if(!!this.expire && ((new Date()).getTime() - this.timestampe > this.expire*1000)){
		this.data = this.expire = null
		this.timestampe = (new Date()).getTime()
	}

	return (timestampe < this.timestampe && !!this.data)?this.data:null
}

function SyncGetter(entity){
	this.entity = entity
	this.timestampe = 0
}
SyncGetter.prototype.get = function(){
	return new Promise((resolve, reject)=>{
		const data = this.entity.get(this.timestampe)
		if(!!data){
			this.timestampe = (new Date()).getTime()
			resolve(data)
		}
	})
}

const entities = []
const trace = () => {
	console.log(entities)
}
const setEntity = (name, data, expire=null) => {
	let entity = entities.find(e=>e.name==name)
	if(!entity){
		entity = new SyncEntity(name)
		entities.push(entity)
	}
	entity.set(data, expire)
	return entity
}
const getter = name => {
	const entity = entities.find(e=>e.name == name)||setEntity(name,null)
	return new SyncGetter(entity)
}
const getSync = name => {
	const entity = entities.find(e=>e.name == name)
	return entity?entity.data:null
}

module.exports = {
	trace,
	setEntity,
	getter,
	getSync
}