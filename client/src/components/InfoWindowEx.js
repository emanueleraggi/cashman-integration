import React, { Component } from 'react';
import { Marker, InfoWindow } from 'google-map-react';

class InfoWindowMap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		};
	}

	handleToggleOpen = () => {
		this.setState({
			isOpen: true
		});
	};

	handleToggleClose = () => {
		this.setState({
			isOpen: false
		});
	};

	render() {
		return (
			<Marker
				key={this.props.index}
				// position={{ lat: this.props.lat, lng: this.props.lng }}
				// label={this.props.index.toString()}
				onClick={() => this.handleToggleOpen()}
			>
				{this.state.isOpen && (
					<InfoWindow onCloseClick={this.props.handleCloseCall}>
						<h1>{this.props.location.venue.name}</h1>
					</InfoWindow>
				)}
			</Marker>
		);
	}
}

export default InfoWindowMap;
