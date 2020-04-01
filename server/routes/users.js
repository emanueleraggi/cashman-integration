const controller = require('../controllers/VesselController')

var express = require('express');
var router = express.Router();

// Company model
const Companies = require('../models/Companies');

// vessel models
const Vessles = require('../models/Vessels');

// position model
const Positions = require('../models/Positions');

const LatitudeLongitude = require('../models/LatitudeLongitude');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.post('/vessles/map', function(req, res) {
	const { callsign, name, imo, mmsi, company } = req.body;
	let errors = [];

	// Check required fields
	if (!callsign || !name || !imo || !mmsi || !company) {
		errors.push({ msg: 'No data received' });
	}
	if (
		Vessles.findOne({ mmsi: mmsi }).then((vessels) => {
			if (vessels) {
				// vessel exists
				const newVessel = new Vessles({
					callsign,
					name,
					imo,
					mmsi,
					company
				});
			}
		})
	);
});

router.post('/vessles/map', function(req, res) {
	const { date, callsign, at, sog, heading, course, loc } = req.body;
	let errors = [];

	// Check required fields
	if (!date || !callsign || !at || !sog || !heading || !course || !loc) {
		errors.push({ msg: 'No data received' });
	}
	if (
		Companies.findOne({ mmsi: mmsi }).then((comp) => {
			if (comp) {
				// vessel exists
				const newVessel = new Vessles({
					date,
					callsign,
					at,
					sog,
					heading,
					course,
					course,
					loc
				});
			}
		})
	);
});

router.post('/vessles/map/latlng', function(req, res) {
	const { name, callsign, heading, sog, imo, mmsi, longitude, latitude, date } = req.body;
	let errors = [];
	console.log('START');
	// Check required fields
	if (!name || !callsign || !heading || !sog || !imo || !mmsi || !longitude || !latitude || !date) {
		errors.push({ msg: 'No data received' });
		console.log('IF LOOP');
	}
	console.log('MONGOSCHEMA');

	// vessel exists
	const newVessel = new LatitudeLongitude({
		name,
		callsign,
		heading,
		sog,
		imo,
		mmsi,
		longitude,
		latitude,
		date
	});
	// Save all vessels info
	// newVessel.save().then((vessel) => {}).catch((err) => console.log(err));
	// console.log('newVessel :', newVessel);
	newVessel.save(function(err, vessel) {
		if (err) return console.log(err);
		// console.log(vessel);
	});
	res.status(200).end();
});

router.post('/vessles/map/latlngdata', function(req, res) {
	const { name, offset } = req.body;
	console.log("11", name, offset);
	try {
		if (!name || !offset) {
			console.log('Not enough input!');
			res.status(500).end();
		}
		controller.getLatLon(req, res);
		// res.send(data);
	} catch (error) {
		res.send(error);
		console.log(error);
	}
})

module.exports = router;
