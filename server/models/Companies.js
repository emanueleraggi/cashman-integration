const mongoose = require('mongoose');
const CompaniesSchema = new mongoose.Schema({
	number: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	icon: {
		type: String,
		required: false
	},
	logo: {
		type: String,
		required: true
	}
});

const Companies = mongoose.model('Companies', CompaniesSchema);
module.exports = Companies;
