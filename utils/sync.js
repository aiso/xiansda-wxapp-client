
function SyncEntity(name){
	this.name = name
}
SyncEntity.prototype.set = function(data){
	this.data = data
	this.timestampe = (new Date()).getTime()
}


function SyncGetter(entity){
	this.entity = entity
	this.timestampe = 0
}
SyncGetter.prototype.get = function(){
	if(this.timestampe < this.entity.timestampe && !!this.entity.data){
		this.timestampe = (new Date()).getTime()
		return Promise.resolve(this.entity.data)
	}else
		return Promise.reject()
}

const entities = []
const trace = () => {
	console.log(entities)
}
const setEntity = (name, data) => {
	let entity = entities.find(e=>e.name==name)
	if(!entity){
		entity = new SyncEntity(name)
		entities.push(entity)
	}
	entity.set(data)
	return entity
}
const getter = name => {
	const entity = entities.find(e=>e.name == name)||setEntity(name,null)
	return new SyncGetter(entity)
}

module.exports = {
	trace,
	setEntity,
	getter
}