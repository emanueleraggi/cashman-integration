const mongoose = require('mongoose');

const LatitudeLongitudeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	callsign: {
		type: String,
		required: true
	},
	heading: {
		type: Number,
		required: false
	},
	sog: {
		type: Number,
		required: true
	},
	imo: {
		type: Number,
		required: false
	},
	mmsi: {
		type: Number,
		required: false
	},
	longitude: {
		type: Number,
		required: false
	},
	latitude: {
		type: Number,
		required: false
	},
	date: {
		type: Date,
		required: true
	}
}, { collection: 'latitudelongitude' }); // not use plural

const LatitudeLongitude = mongoose.model('LatitudeLongitude', LatitudeLongitudeSchema);
module.exports = LatitudeLongitude;
