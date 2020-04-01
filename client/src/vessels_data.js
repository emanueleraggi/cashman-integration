import img1 from './images/nameofvessel1.png';

import vessel1 from './images/nameofvessel1-details-1.png';
import vessel2 from './images/nameofvessel1-details-2.png';
import vessel3 from './images/nameofvessel1-details-3.png';

import img2 from './images/nameofvessel2.png';

import vessel4 from './images/nameofvessel2-details-1.png';
import vessel5 from './images/nameofvessel2-details-2.png';
import vessel6 from './images/nameofvessel2-details-3.png';
import vessel7 from './images/nameofvessel2-details-4.png';

export default [
	{
		sys: {
			id: '1'
		},
		fields: {
			name: 'Atchafalaya',
			slug: 'Atchafalaya',
			type: 'Hopper',
			length: 100,
			size: 113,
			callsign: 'WDF6708',
			MMSI: 367453000,
			MMSI_Y_N: true,
			IMO_Y_N: true,
			IMO: 7914248,
			capacity: 1300,
			featured: false,
			company: 'Cashman-Drdeging',
			description: 'Trailing Suction Hopper Dredge',
			extras: [
				'Disposes of dredge material by bottom-dumping or pumping out material through an on-board pump system',
				'Works well in harbors, inland waterways, and unprotected waters',
				'Outfitted with a twin screw propulsion system',
				'Shallow draft and high maneuverability allow operation in tight quarters easily',
				'Equipped with state-of-the-art dredging production and operations monitering instrumentation'
			],
			images: [
				{
					fields: {
						file: {
							url: img1
						}
					}
				},
				{
					fields: {
						file: {
							url: vessel1
						}
					}
				},
				{
					fields: {
						file: {
							url: vessel2
						}
					}
				},
				{
					fields: {
						file: {
							url: vessel3
						}
					}
				}
			]
		}
	},

	{
		sys: {
			id: '2'
		},
		fields: {
			name: 'name of vessel',
			slug: 'name of vessel',
			type: 'type of vessel',
			length: 100,
			size: 113,
			callsign: 'put callsign',
			MMSI: 'NA',
			MMSI_Y_N: false,
			IMO_Y_N: false,
			IMO: 'NA',
			capacity: 1300,
			featured: false,
			company: 'Put name of company',
			description: 'Put here description of the main features of the vessels.',
			extras: [ 'Add technical details as above' ],
			images: [
				{
					fields: {
						file: {
							url: img2
						}
					}
				},
				{
					fields: {
						file: {
							url: vessel4
						}
					}
				},
				{
					fields: {
						file: {
							url: vessel5
						}
					}
				},
				{
					fields: {
						file: {
							url: vessel6
						}
					}
				},
				{
					fields: {
						file: {
							url: vessel7
						}
					}
				}
			]
		}
	}
];
