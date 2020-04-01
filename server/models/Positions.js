const mongoose = require('mongoose');
const PositionsSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true
	},
	callsign: {
		type: String,
		required: true
	},
	at: {
		type: String,
		required: false
	},
	speed: {
		type: String,
		required: true
	},
	heading: {
		type: String,
		required: false
	},
	course: {
		type: String,
		required: false
	},
	loc: {
		type: Object,
		required: false
	}
});

const Positions = mongoose.model('Positions', PositionsSchema);
module.exports = Positions;
