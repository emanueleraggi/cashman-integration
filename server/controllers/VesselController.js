const Vessels = require('../models/Vessels');
const Positions = require('../models/Positions');
const Compnanies = require('../models/Companies');
const LatitudeLongitude = require('../models/LatitudeLongitude')

module.exports.getBaseAll = (req, res) => {
	Promise.all([
		Compnanies.find(),
		Vessels.find(),
		Positions.aggregate([
			{
				$sort: {
					date: -1
				}
			},
			{
				$group: {
					_id: '$callsign',
					details: {
						$push: '$$ROOT'
					}
				}
			},
			{
				$replaceRoot: {
					newRoot: {
						$arrayElemAt: [ '$details', 0 ]
					}
				}
			}
		])
	])
		.then(([ companies, vessels, positions ]) => {
			// apply vessels detail table as join:
			positions.forEach((pos) => {
				vessels.forEach((ves) => {
					if (pos.callsign == ves.callsign) {
						p._detail = ves;
					}
				});
				companies.forEach((com) => {
					if (p._detail.company == com.number) {
						p._detail = com;
					}
				});
			});
			res.status(200).json(positions);
		})
		.catch((err) => {
			return res.status(500).send(err);
		});
	console.log(vesselController.getBaseAll);
};

module.exports.getHistory = (req, res) => {
	var id = req.param.id;
	Positions.find(
		{
			callsign: id,
			date: {
				$gte: new Date(Date.now() - 1000 * 60 * 60 * 24)
			}
		},
		(err, task) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.status(200).json(task);
		}
	);
	console.log(vesselController.getHistory);
};

module.exports.getCurrent = (req, res) => {
	var currentPos = Positions.find({
		date: {
			$gte: new Date(Date.now() - 1000 * 60 * 60)
		}
	});
	currentPos.exec((err, task) => {
		if (err) {
			return res.status(500).send(err);
		}
		res.status(200).json(task);
	});
	console.log(vesselController.getCurrent);
};

const OffsetSelector = {
	'1 hour': {'ms': 3600000, 'c': 'green'},
	'6 hours': {'ms': 6*3600000, 'c': 'orange'},
	'12 hours': {'ms': 12*3600000, 'c': 'yellow'},
	'1 day': {'ms': 24*3600000, 'c': 'blue'},
}

exports.getLatLon = (req, res) => {
	const { name, offset } = req.body;
	const dateCutOff = new Date(Date.now() - OffsetSelector[offset].ms);
	LatitudeLongitude.find(
		{ name: name, date: { $gte: dateCutOff } }, 
		'latitude longitude date',
		function (err, data) {
			console.log("data: ", data);
			if (err) {
				return res.status(500).send(err);
			}
			res.status(200).json(data);
		})
	// console.log("retrieve: ", latlngHistory);
};

exports.getLatitude = (req, res) => {};

exports.getLongitude = (req, res) => {};
