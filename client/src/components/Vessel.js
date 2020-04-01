import React from 'react';
import { Link } from 'react-router-dom';
import defaultImg from '../images/boat.jpg';
import propTypes from 'prop-types';
// import { VesselProvider } from '../context';
export default function Vessel({ vessel }) {
	const { name, slug, images /* size */ } = vessel;

	return (
		<article className="room">
			<div className="img-container">
				<img src={images[0] || defaultImg} alt="single room" />
				<div className="price-top">
					<h6>View</h6>
				</div>
				<Link to={`/vessels/${slug}`} className="btn-primary room-link">
					Features
				</Link>
			</div>
			<p className="room-info">{name}</p>
		</article>
	);
}

Vessel.propTypes = {
	vessel: propTypes.shape({
		name: propTypes.string.isRequired,
		slug: propTypes.string.isRequired,
		images: propTypes.arrayOf(propTypes.string).isRequired
		// size: propTypes.number.isRequired
	})
};
