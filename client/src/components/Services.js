import React, { Component } from 'react';
import { FaLocationArrow, FaShip } from 'react-icons/fa';
import { IoMdLocate } from 'react-icons/io';
import { MdLocationOn } from 'react-icons/md';

import Title from './Title';

export default class Services extends Component {
	state = {
		services: [
			{
				icon: <FaLocationArrow />,
				title: 'GeoLocalization',
				info: 'Possibility for geolocalization of boats for research purposes'
			},
			{
				icon: <FaShip />,
				title: 'Project',
				info:
					'Possibility for obtaining detailed informations about vessels currently operating and additional specifications'
			},
			{
				icon: <IoMdLocate />,
				title: 'Localization',
				info:
					'Possibility of localizing one or more vessels simultaneously, detailed informations are provideed on name, speed, type'
			},
			{
				icon: <MdLocationOn />,
				title: 'Marker',
				info:
					'Possibility of localizing markers related to specific vessels and, when available, project information'
			}
		]
	};

	render() {
		return (
			<section className="services">
				<Title title="Features" />
				<div className="services-center">
					{this.state.services.map((item, index) => {
						return (
							<article key={index} className="service">
								<span>{item.icon}</span>
								<h6>{item.title}</h6>
								<p>{item.info}</p>
							</article>
						);
					})}
				</div>
			</section>
		);
	}
}
