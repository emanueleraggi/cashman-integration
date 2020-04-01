const mongoose = require('mongoose');

const VesselsSchema = new mongoose.Schema({
	callsign: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: false
	},
	imo: {
		type: Number,
		required: true
	},
	mmsi: {
		type: Number,
		required: false
	},
	company: {
		type: String,
		require: false
	}
});

const Vessels = mongoose.model('Vessels', VesselsSchema);
module.exports = Vessels;
