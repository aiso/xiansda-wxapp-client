'use strict';

const api = require('request.js')
const sync = require('../utils/sync.js')

/*
const stations = sync.initEntity('stations', ()=>{
    return api.get('client/stations').then(data=>{
      return data.stations
    })
})
*/
const stations = sync.setEntity('stations')

module.exports = {
	stations
}