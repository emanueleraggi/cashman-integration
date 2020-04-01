import React, { Component } from 'react';
// import {VesselContext, VesselProvider} from "../context"
import { VesselContext } from '../context';

import Loading from './Loading';
import Vessel from './Vessel';
import Title from './Title';

export default class FeaturedVessels extends Component {
	static contextType = VesselContext;
	render() {
		let { loading, featuredVessels: vessels } = this.context;
		vessels = vessels.map((vessel) => {
			return <Vessel key={vessel.id} vessel={vessel} />;
		});

		return (
			<section className="featured-rooms">
				<Title title="Featured Vessels" />
				<div className="featured-rooms-center">{loading ? <Loading /> : vessels}</div>
			</section>
		);
	}
}
