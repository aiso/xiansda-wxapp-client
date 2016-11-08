'use strict';

const api = require('request.js')


const station = () => api.get('station/'+getApp().getAuth().profile.station)

module.exports = {
	station
}