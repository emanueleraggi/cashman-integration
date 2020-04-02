var express = require('express');
var router = express.Router();
var axios = require('axios');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

let hitCount = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

// const mmsiOfInterest2 = [
// 	'367029520' + 'MICHIGAN', // ok -> MICHIGAN
// 	'366909730' + 'MICHIGAN', // ok -> JP BOISSEAU
// 	'367128570' + 'MICHIGAN', // ok -> DELAWARE BAY
// 	'366744010' + 'MICHIGAN' // ok -> ATLANTIC SALVOR
// ];

// const shipNamesOfInterest2 = [
// 	'MICHIGAN', // ok
// 	'JP BOISSEAU', // ok
// 	'DELAWARE BAY', // ok
// 	'ATLANTIC SALVOR' // ok
// ];

const imoOfInterest = [
	7915838, // STUYVESANT
	7428263, // COLUMBIA
	7819539, // TERRAPIN ISLAND
	7807720, // SUGAR ISLAND
	8101783, // PADRE ISLAND
	9224831, // LIBERTY ISLAND
	7917800, // DODGE ISLAND
	8308616, // NEWPORT
	8993784, // BAYPORT
	9329045, // GLENN EDWARDS
	7923495, // ESSAYONS
	7923445, // YAQUINA
	7739856, // MCFARLAND
	7923184, // WHEELER
	8402773, // B.E.LINDHOLM
	8516079, // RN WEEKS
	9652210, // MAGDALEN
	7914248 // ATCHAFALAYA
];

const callsignOfInterest = [
	'WNFX', // STUYVESANT
	'WDF3225', // COLUMBIA
	'KGDS', // TERRAPIN ISLAND
	'V7KY3', // SUGAR ISLAND (this is not a US vessel)
	'WDB4436', // PADRE ISLAND
	'WDPF', // LIBERTY ISLAND
	'WDB4450', // DODGE ISLAND
	'WRC2930', // NEWPORT
	'WCZ4240', // BAYPORT
	'WDC8439', // GLENN EDWARDS
	'AENO', // ESSAYONS
	'AEPD', // YAQUINA
	'AEGB', // MCFARLAND
	'AEQZ', // WHEELER
	'AELE', // MURDEN
	'WCY9878', // B.E.LINDHOLM
	'WBV3250', // RN WEEKS
	'WDJ7547', // MAGDALEN
	'WDF6708' // ATCHAFALAYA
];

const mmsiOfInterest = [
	367029520, // ok -> MICHIGAN
	368098000, // ok -> STUYVESANT
	367437430, // ok -> COLUMBIA
	366692000, // ok -> TERRAPIN ISLAND
	538002695, // ok -> SUGAR ISLAND
	367525000, // ok -> PADRE ISLAND
	369053000, // ok -> LIBERTY ISLAND
	303589000, // ok -> DODGE ISLAND
	366942880, // ok -> NEWPORT
	338570000, // ok -> BAYPORT
	367087140, // ok -> GLENN EDWARDS
	367473140, // ok -> VIRGINIAN
	367473180, // ok -> ATLANTIC
	368683000, // ok -> CHARLESTEON
	367473150, // ok -> PULLEN
	366972000, // ok -> ESSAYONS
	366971000, // ok -> YAQUINA
	338997000, // ok -> MCFARLAND
	366982000, // ok -> WHEELER
	369970571, // ok -> MURDEN
	369970446, // ok -> CURRITUCK
	368954410, // ok -> B.E.LINDHOLM
	366955430, // ok -> R S WEEKS
	303390000, // ok -> RN WEEKS
	369305000, // ok -> MAGDALEN
	367453000 // ok -> ATCHAFALAYA
];

// const mmsiOfInterest = [
// 	'367029520', // ok -> MICHIGAN
// 	'366909730', // ok -> JP BOISSEAU
// 	'367128570', // ok -> DELAWARE BAY
// 	'366744010', // ok -> ATLANTIC SALVOR
// 	'368098000', // ok -> STUYVESANT
// 	'367324810', // ok -> PAULA LEE
// 	'367437430', // ok -> COLUMBIA
// 	'367188386', // ok -> OHIO (GLDD last received 2014)
// 	'369010000', // ok -> DREDGE TEXAS
// 	'366692000', // ok -> TERRAPIN ISLAND
// 	'366796250', // ok -> DREDGE ILLINOIS
// 	'367340160', // ok -> CAROLINA
// 	'338025000', // ok -> GL54
// 	'538002695', // ok -> SUGAR ISLAND
// 	'367525000', // ok -> PADRE ISLAND
// 	'366896390', // ok -> DREDGE 55
// 	'369118000', // ok -> DREDGE NEW YORK
// 	'369053000', // ok -> LIBERTY ISLAND
// 	'367157000', // ok -> DREDGE 51
// 	'367131000', // ok -> ALASKA
// 	'303589000', // ok -> DODGE ISLAND
// 	'367366670', // ok -> VULCAN
// 	'366942880', // ok -> NEWPORT
// 	'338570000', // ok -> BAYPORT
// 	'366053209', // ok -> DREDGE NJORD
// 	'366924720', // ok -> HAGAR
// 	'366806940', // ok -> VALHALLA
// 	'367421990', // ok -> H.R. MORRIS
// 	'367785950', // ok -> ROBERT M. WHITE
// 	'367389840', // ok -> DREDGE EINAR
// 	'367087140', // ok -> GLENN EDWARDS
// 	'367756560', // ok -> PETER DEJONG
// 	'338107888', // ok -> DREDGE HAMPTON ROADS
// 	'338160398', // ok -> DREDGE SAVANNAH
// 	'367310140', // ok -> DREDGE E STROUD
// 	'367338310', // ok -> DREDGE 32
// 	'367189030', // ok -> MISSOURI H
// 	'367413270', // ok -> MIKE HOOKS
// 	'367473140', // ok -> VIRGINIAN
// 	'367473180', // ok -> ATLANTIC
// 	'368683000', // ok -> CHARLESTON
// 	'367473150', // ok -> PULLEN
// 	'367652280', // ok -> DREDGE 428
// 	'367473230', // ok -> ESSEX
// 	'367466940', // ok -> LINDA LAQUAY
// 	'367317850', // ok -> JOHN C.LAQUAY
// 	'367141920', // ok -> WAYMON L BOYD
// 	'368756000', // ok -> HURLEY
// 	'369970726', // ok -> DREDGE GOETZ
// 	'366972000', // ok -> ESSAYONS
// 	'366971000', // ok -> YAQUINA
// 	'338997000', // ok -> MCFARLAND
// 	'366982000', // ok -> WHEELER
// 	'369970571', // ok -> MURDEN
// 	'369970446', // ok -> CURRITUCK
// 	'507027', // ok -> WEEKS 551
// 	'367333540', // ok -> BORINQUEN
// 	'367500770', // ok -> G D MORGRAN
// 	'367176730', // ok -> 506 BUCKET DREDGE
// 	'367323150', // ok -> E W ELLEFSEN
// 	'367529860', // ok -> C R MCCASKILL
// 	'368954410', // ok -> B.E.LINDHOLM
// 	'366955430', // ok -> R S WEEKS
// 	'303390000', // ok -> R.N.WEEKS
// 	'369305000', // ok -> MAGDALEN
// 	'367500810', // ok -> CAPT FRANK
// 	'367091750', // ok -> CAPT. AJ FOURNIER
// 	'338111149', // ok -> FJ BELESIMO
// 	'367766220', // ok -> DALE PYATT
// 	'367453000' // ok -> ATCHAFALAYA
// ];

// const mmsiOfInterest = [
// 	367029520, // ok -> MICHIGAN
// 	366909730, // ok -> JP BOISSEAU
// 	367128570, // ok -> DELAWARE BAY
// 	366744010, // ok -> ATLANTIC SALVOR
// 	368098000, // ok -> STUYVESANT
// 	367324810, // ok -> PAULA LEE
// 	367437430, // ok -> COLUMBIA
// 	367188386, // ok -> OHIO (GLDD last received 2014)
// 	369010000, // ok -> DREDGE TEXAS
// 	366692000, // ok -> TERRAPIN ISLAND
// 	366796250, // ok -> DREDGE ILLINOIS
// 	367340160, // ok -> CAROLINA
// 	338025000, // ok -> GL54
// 	538002695, // ok -> SUGAR ISLAND
// 	367525000, // ok -> PADRE ISLAND
// 	366896390, // ok -> DREDGE 55
// 	369118000, // ok -> DREDGE NEW YORK
// 	369053000, // ok -> LIBERTY ISLAND
// 	367157000, // ok -> DREDGE 51
// 	367131000, // ok -> ALASKA
// 	303589000, // ok -> DODGE ISLAND
// 	367366670, // ok -> VULCAN
// 	366942880, // ok -> NEWPORT
// 	338570000, // ok -> BAYPORT
// 	366053209, // ok -> DREDGE NJORD
// 	366924720, // ok -> HAGAR
// 	366806940, // ok -> VALHALLA
// 	367421990, // ok -> H.R. MORRIS
// 	367785950, // ok -> ROBERT M. WHITE
// 	367389840, // ok -> DREDGE EINAR
// 	367087140, // ok -> GLENN EDWARDS
// 	367756560, // ok -> PETER DEJONG
// 	338107888, // ok -> DREDGE HAMPTON ROADS
// 	338160398, // ok -> DREDGE SAVANNAH
// 	367310140, // ok -> DREDGE E STROUD
// 	367338310, // ok -> DREDGE 32
// 	367189030, // ok -> MISSOURI H
// 	367413270, // ok -> MIKE HOOKS
// 	367473140, // ok -> VIRGINIAN
// 	367473180, // ok -> ATLANTIC
// 	368683000, // ok -> CHARLESTON
// 	367473150, // ok -> PULLEN
// 	367652280, // ok -> DREDGE 428
// 	367473230, // ok -> ESSEX
// 	367466940, // ok -> LINDA LAQUAY
// 	367317850, // ok -> JOHN C.LAQUAY
// 	367141920, // ok -> WAYMON L BOYD
// 	368756000, // ok -> HURLEY
// 	369970726, // ok -> DREDGE GOETZ
// 	366972000, // ok -> ESSAYONS
// 	366971000, // ok -> YAQUINA
// 	338997000, // ok -> MCFARLAND
// 	366982000, // ok -> WHEELER
// 	369970571, // ok -> MURDEN
// 	369970446, // ok -> CURRITUCK
// 	507027, // ok -> WEEKS 551
// 	367333540, // ok -> BORINQUEN
// 	367500770, // ok -> G D MORGRAN
// 	367176730, // ok -> 506 BUCKET DREDGE
// 	367323150, // ok -> E W ELLEFSEN
// 	367529860, // ok -> C R MCCASKILL
// 	368954410, // ok -> B.E.LINDHOLM
// 	366955430, // ok -> R S WEEKS
// 	303390000, // ok -> R.N.WEEKS
// 	369305000, // ok -> MAGDALEN
// 	367500810, // ok -> CAPT FRANK
// 	367091750, // ok -> CAPT. AJ FOURNIER
// 	338111149, // ok -> FJ BELESIMO
// 	367766220, // ok -> DALE PYATT
// 	367453000 // ok -> ATCHAFALAYA
// ];

// const shipNamesOfInterest = [
// 	'MICHIGAN', // ok
// 	'JP BOISSEAU', // ok
// 	'DELAWARE BAY', // ok
// 	'ATLANTIC SALVOR', // ok
// 	'STUYVESANT', // ok
// 	'PAULA LEE', // pilot vessel
// 	'COLUMBIA', // ok
// 	'OHIO', // ok
// 	'DREDGE TEXAS', // ok
// 	'TERRAPIN ISLAND', // ok
// 	'DREDGE ILLINOIS', // ok
// 	'CAROLINA', // ok
// 	'GL54', // ok
// 	'SUGAR ISLAND', // ok
// 	'PADRE ISLAND', // ok
// 	'DREDGE 55', // ok
// 	'DREDGE NEW YORK', // ok
// 	'LIBERTY ISLAND', // ok
// 	'DREDGE 51', // ok
// 	'ALASKA', // ok
// 	'DODGE ISLAND', // ok
// 	'VULCAN', // ok
// 	'NEWPORT', // ok
// 	'BAYPORT', // ok
// 	'DREDGE NJORD', // ok
// 	'HAGAR', // ok
// 	'VALHALLA', // ok
// 	'H R MORRIS', // ok
// 	'ROBERT M. WHITE', // ok
// 	'DREDGE EINAR', // ok
// 	'GLENN EDWARDS', // ok
// 	'PETER DEJONG', // ok
// 	'DREDGE HAMPTON ROADS', // ok
// 	'DREDGE SAVANNAH', // ok
// 	'DREDGE E STROUD', // ok
// 	'DREDGE 32', // ok
// 	'MISSOURI H', // ok
// 	'MIKE HOOKS', // ok
// 	'VIRGINIAN', // ok
// 	'ATLANTIC', // ok
// 	'CHARLESTEON', // ok
// 	'PULLEN', // ok
// 	'DREDGE 428', // ok
// 	'ESSEX', // ok
// 	'LINDA LAQUAY', // ok
// 	'JOHN C.LAQUAY', // ok
// 	'WAYMON L BOYD', // ok
// 	'HURLEY', // ok
// 	'DREDGE GOETZ', // ok
// 	'ESSAYONS', // ok
// 	'YAQUINA', // ok
// 	'MCFARLAND', // ok
// 	'DREDGE WHEELER', // ok
// 	'MURDEN', // ok
// 	'CURRITUCK', // ok
// 	'WEEKS 551', // ok
// 	'BORINQUEN', // ok
// 	'G D MORGRAN', // ok last signal received February 2019
// 	'506 BUCKET DREDGE', // ok
// 	'E W ELLEFSEN', // ok
// 	'C R MCCASKILL', // ok
// 	'B.E. LINDHOLM', // ok
// 	'R S WEEKS', // ok
// 	'RN WEEKS', // ok
// 	'MAGDALEN', // ok
// 	'CAPT FRANK', // ok
// 	'CAPT. AJ FOURNIER', // ok
// 	'FJ BELESIMO', // ok
// 	'DALE PYATT', // ok
// 	'ATCHAFALAYA' // ok
// ];

const shipNamesOfInterest = [
	'MICHIGAN', // ok
	'STUYVESANT', // ok
	'COLUMBIA', // ok
	'TERRAPIN ISLAND', // ok
	'SUGAR ISLAND', // ok
	'PADRE ISLAND', // ok
	'LIBERTY ISLAND', // ok
	'DODGE ISLAND', // ok
	'NEWPORT', // ok
	'BAYPORT', // ok
	'GLENN EDWARDS', // ok
	'VIRGINIAN', // ok
	'ATLANTIC', // ok
	'CHARLESTEON', // ok
	'PULLEN', // ok
	'ESSAYONS', // ok
	'YAQUINA', // ok
	'MCFARLAND', // ok
	'DREDGE WHEELER', // ok
	'MURDEN', // ok
	'CURRITUCK', // ok
	'B.E. LINDHOLM', // ok
	'R S WEEKS', // ok
	'RN WEEKS', // ok
	'MAGDALEN', // ok
	'ATCHAFALAYA' // ok
];

router.get('/hello', async function(req, res, next) {
	//
	const allData = myCache.get('allData');

	if (!allData) {
		hitCount++;
		console.log(`hit ${hitCount} number of times`);

		try {
			const { data } = await axios.get(
				// 'http://data.aishub.net/ws.php?username=AH_3076_929F7762&format=1&output=json&compress=0&latmin=11.42&latmax=58.20&lonmin=-134.09&lonmax=-52.62'
				// 'http://data.aishub.net/ws.php?username=AH_3076_929F7762&format=1&output=json&compress=0&mmsi=366971000'
				// 'http://data.aishub.net/ws.php?username=AH_3076_929F7762&format=1&output=json&compress=0'
				'https://api.vesselfinder.com/vesselslist?userkey=WS-49271A06-D7E069'
			);
			// console.log(data);
			const [ metaData, ships ] = data;
			// 	const shipsOfInterest = ships.filter(
			// 		(ship) => mmsiOfInterest.includes(ship.MMSI) && shipNamesOfInterest.includes(ship.NAME)
			// 	);
			// 	const filterdShips = shipsOfInterest.reduce((array, value) => {
			// 		const isValueAlreadyInArray = !!array.find((something) => something.MMSI === value.MMSI);
			// 		if (isValueAlreadyInArray) {
			// 			return array;
			// 		} else {
			// 			array.push(value);
			// 			return array;
			// 		}
			// 	}, []);
			myCache.set('allData', data, 70);
			console.log(data + 'This is the data');
			res.send(data);
		} catch (error) {
			res.send(error);
			console.log(error);
		}

		// return;
	}

	console.log('this is the data:', allData);
	// console.log(data);
	res.send(allData);
	// return;
});

module.exports = router;
