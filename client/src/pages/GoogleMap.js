import React, { Component } from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
// import { InfoWindow } from 'google-maps-react'
import ShipTracker from '../components/ShipTracker';
import SideBar from '../components/SideBar';
import { Ship } from '../components/ShipTracker';
import Client from '../Contentful';
// import InfoWindowMap from '../components/InfoWindowEx';
import { MyInfoWindowWidget } from "../components/MyInfoWindow"
import { MyDropDown } from "../components/MyDropDownMenu"
// import { dummyData } from "../components/DummyData"
import { shipCompanyMap } from "../components/ShipTracker"
import Polyline from "../components/Polyline"

// import icon from '../logos/weeksmarine.png';

// import MapControl from '../components/MapControl';
// import { MarkerClickHandle } from '../components/ShipTracker';
// 	grid-template-areas: "google-map   sidebar" "ship-tracker sidebar";

const MapContainer = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr;
	grid-template-rows: 1fr 200px;
	grid-gap: 10px;
	height: 100vh;
	grid-template-areas: "google-map   sidebar" "ship-tracker sidebar";

	.google-map {
		background: #424242;
		grid-area: google-map;
		position: relative;
		height: 100%;
		width: 100%;
	}
	.map-sidebar {
		background: #9dc183;
		grid-area: sidebar;
	}
	.ship-tracker {
		grid-area: ship-tracker;
	}
	option.active {
		background: yellow;
	}
`;

// var expanded = false;
// function showCheckboxes() {
// 	var checkboxes = document.getElementById('checkboxes');
// 	if (!expanded) {
// 		checkboxes.style.display = 'block';
// 		expanded = true;
// 	} else {
// 		checkboxes.style.display = 'none';
// 		expanded = false;
// 	}
// }

class BoatMap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			buttonEnabled: false,
			buttonClickedAt: new Date(),
			progress: 0,
			ships: [],
			filteredShips: [],
			type: 'All',
			shipTypes: [],
			activeShipTypes: [],
			logoMap: {},
			showingInfoWindow: false,
			hoverOnActiveShip: null,
			delayHandler: null,
			mapControlShouldRender: false,
			trajectoryColor: 'black',
			trajectoryData: [],
			mapLoaded: false,
		};
		this.updateRequest = this.updateRequest.bind(this);
		this.countDownInterval = null;
		this.map = null;
		this.maps = null;
	}

	async componentDidMount() {
		this.countDownInterval = setInterval(() => {
			// if (!this.state.buttonClickedAt) return;
			// const date = new Date();
			// const diff = Math.floor((date.getTime() - this.state.buttonClickedAt.getTime()) / 1000);
			// if (diff < 90) {
			// 	this.setState({
			// 		progress: diff,
			// 		buttonEnabled: false
			// 	});
			// } else {
			// 	this.setState({
			// 		progress: 0,
			// 		buttonClickedAt: null,
			// 		buttonEnabled: true
			// 	});
			// }
		}, 500);

		await this.updateRequest();

		// let newShips = localStorage.getItem('shipData');
		// debugger;

		// if (newShips) {
		// 	this.setState({ ships: newShips });
		// }

		let updateInterval = setInterval(() => {
			this.updateRequest();
		}, 60 * 1000);
		this.setState({ updateInterval });
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.type !== prevState.type) {
			console.log('dropdown value changed for ' + this.state.type);
		}
	}

	componentWillUnmount() {
		// this.state.updateInterval;
		clearInterval(this.countdownInterval);
	}

	componentWillMount = async () => {
		const shipTypeResults = await Client.getEntries({
			content_type: 'cashmanCompetitors'
		});
		const shipTypes = shipTypeResults.items.map((data) => data.fields);
		const logoMap = shipTypes.reduce((acc, type) => {
			return {
				...acc,
				[type.name]: type.images.fields.file.url
			};
		}, {});
		this.setState({shipTypes: Array.from(shipTypes), logoMap: logoMap});
	}

	async updateRequest() {
		const url = 'http://localhost:3001/hello';
		const fetchingData = await fetch(url);
		const ships = await fetchingData.json();
		console.log('fetched ships', ships);

		// solve the TypeError: this.state.ships.map is not a function
		// const ships = dummyData;
		if (JSON.stringify(ships) !== '{}'){
			this.setState({
				ships: ships,
				filteredShips: ships,
			});
			this.props.callbackFromParent(ships);
			
			for (let ship of ships) {
				let _ship = {
					name: ship.AIS.NAME,
					callsign: ship.AIS.CALLSIGN,
					heading: ship.AIS.HEADING,
					sog: ship.AIS.TYPE, // unknown abbr.
					imo: ship.AIS.IMO,
					mmsi: ship.AIS.MMSI,
					longitude: ship.AIS.LONGITUDE,
					latitude: ship.AIS.LATITUDE,
					date: new Date(ship.AIS.TIMESTAMP)
				};
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(_ship),
				};
				await fetch('http://localhost:3001/users/vessles/map/latlng', requestOptions);
			}
		}
	}

	// handleChange = (e) => {
	// 	this.setState({
	// 		type: e.target.value
	// 	});
	// 	console.log(e.target.value);
	// };

	handleMarkerClick = (event, data) => {
		this.props.setActiveShip(data.AIS.NAME, data.AIS.LATITUDE, data.AIS.LONGITUDE);
		// console.log('marker click');
		// console.log(event.target, data);
		// console.log(data.AIS.NAME);
		// return data;
		// this.props.setActiveShip(data.NAME, data.LATITUDE, data.LONGITUDE, this.state.ships.images);
	};

	handleMarkerHoverOnShip = (event, data) => {
		this.setState({
				showingInfoWindow: true,
				hoverOnActiveShip: data});
		clearTimeout(this.state.delayHandler)
	};

	handleMarkerHoverOffInfoWin = (event) => {
		let delayHandler = setTimeout(
			() => {
				this.setState({
					showingInfoWindow: false, 
					hoverOnActiveShip: null,
			})}, 1000) // 1s to disappear
		this.setState({ delayHandler: delayHandler })
	};

	handleMarkerHoverOnInfoWin = (event) => {
		clearTimeout(this.state.delayHandler)
	}

	changeFilteredShips = (options) => {
		if (options === 'All') {
			this.setState({filteredShips: this.state.ships})
		} else {
			const filteredShips = this.state.ships.filter((ship) => {
				return options.includes(shipCompanyMap[ship.AIS.NAME])
			});
			this.setState({filteredShips: filteredShips});
		}
	}

	setTrajectoryData = (data, color) => {
		this.setState({trajectoryData: data})
		this.setState({trajectoryColor: color})
	}

	render() {
		const noHoverOnShip = this.state.hoverOnActiveShip === null;
		console.log("color", this.state.trajectoryColor);
		return (
			<div className="google-map">
				<GoogleMapReact
					// ships={this.state.ships}
					bootstrapURLKeys={{ key: 'AIzaSyBm59I3P5VB3JR25MWz-GKgf4PZs8XEsqc' }}
					center={{
						lat: this.props.activeShip ? this.props.activeShip.latitude : 37.99,
						lng: this.props.activeShip ? this.props.activeShip.longitude : -97.31
					}}
					zoom={5.5}
					onGoogleApiLoaded={({map, maps}) => {
						this.map = map;
						this.maps = maps;
						// we need this setState to force the first mapcontrol render
						this.setState({mapControlShouldRender: true, mapLoaded: true})
					  }}
				>

					{this.state.mapLoaded ? 
						<div>
							<Polyline
								map={this.map}
								maps={this.maps}
								markers={this.state.trajectoryData}
								lineColor={this.state.trajectoryColor}>
							</Polyline>
						</div>
					: ''}
					{/* {filteredShips.map((ship) => (
						<Ship ship={ship} key={ship.CALLSIGN} lat={ship.LATITUDE} lng={ship.LONGITUDE} />
					))} */}

					{/* Rendering all the markers here */}
					{this.state.filteredShips.map((ship) => (
						<Ship
							ship={ship}
							key={ship.AIS.MMSI}
							lat={ship.AIS.LATITUDE}
							lng={ship.AIS.LONGITUDE}
							logoMap={this.state.logoMap}
							logoClick={this.handleMarkerClick}
							logoHoverOn={this.handleMarkerHoverOnShip}
							logoHoverOff={this.handleMarkerHoverOffInfoWin}
							// logoHoverOff={this.handleMarkerHoverOff}
							// windowClickOpen={this.handleWindow}
						/>
					))}

					<MyInfoWindowWidget
						show={this.state.showingInfoWindow}
						ship={this.state.hoverOnActiveShip}
						logoMap={this.state.logoMap}
						lat={noHoverOnShip ? -1 : this.state.hoverOnActiveShip.AIS.LATITUDE}
						lng={noHoverOnShip ? -1 : this.state.hoverOnActiveShip.AIS.LONGITUDE}
						shipFromDatabase={this.props.shipFromDatabase}
						closeInfoWindow={this.handleMarkerHoverOffInfoWin}
						keepInfoWindow={this.handleMarkerHoverOnInfoWin}
						setTrajectoryData={this.setTrajectoryData}
					/>

					{/* Below are the hard-coded values. They should come from the external container Contentful.  */}
					{/* The values in the Contentful are exactly the same: DONJON, DUTRA, MANSON etc... */}

					{/* <select className="combo-companies" onClick={this.props.handleDropdownChange}>
						{console.log("drop down shipTypes: ", this.state.shipTypes)}

						{this.state.shipTypes.map((type) => {
							// console.log("drop down type",type);
							return (
								<option
									className={this.state.activeShipTypes.includes(type) ? 'active' : ''}
									key={type.images.sys.id}
									value={type.name}
								>
									{type.name}
								</option>
							);
						})}
					</select> */}
					<MyDropDown
						shipTypes={this.state.shipTypes}
						activeShipTypes={this.state.activeShipTypes}
						map={this.map || null}
						controlPosition={this.maps ? this.maps.ControlPosition.LEFT_TOP : null}
						changeFilteredShips={this.changeFilteredShips}
					/>
					
					{/* <div class="progress-circle p0">
						<span>{this.state.progress}%</span>
						<div class="left-half-clipper">
							<div class="first50-bar" />
							<div class="value-bar" />
						</div>
					</div>
					<button className="btn-next-request" onClick={() => this.updateRequest()}>
						Time to Next API Request
					</button> */}

					{/* <InfoWindowEx marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
						<div>
							<h3>{this.state.selectedPlace.name}</h3>
							<button type="button" onClick={this.showDetails.bind(this, this.state.selectedPlace)}>
								Show details
							</button>
						</div>
					</InfoWindowEx> */}
				</GoogleMapReact>
			</div>
		);
	}
}

export default class GoogleMap extends React.Component {
	state = {
		ships: [],
		activeShipTypes: [],
		activeCompanies: [],
		activeShip: null,
		shipFromDatabase: [],
	};

	// async componentDidMount() {
	// 	const url = 'http://localhost:3001/hello';
	// 	// console.log(url);
	// 	const fetchingData = await fetch(url);
	// 	const ships = await fetchingData.json();

	// 	console.log('fetched ships', ships);
	// 	//console.log(ships);

	// 	this.setState({
	// 		ships
	// 	});
	// }

	handleDropdownChange = (e) => {
		const shipType = e.target.value;

		if (this.state.activeShipTypes.includes(shipType)) {
			const filteredShipTypes = this.state.activeShipTypes.filter((type) => type !== shipType);
			this.setState({
				activeShipTypes: filteredShipTypes
			});
		} else {
			this.setState({
				activeShipTypes: [ ...this.state.activeShipTypes, shipType ]
			});
		}
	};

	setActiveShip = (name, latitude, longitude) => {
		this.setState({
			activeShip: {
				name,
				latitude,
				longitude
			}
		});
	};

	setShipDatabase = (ships) => {
		this.setState({shipFromDatabase: ships})
	}

	// passing data from children to parent
	callbackFromParent = (ships) => {
		this.setState({ships})
	}

	render() {
		// const images = markedShip ? markedShip.images : null;
		return (
			<MapContainer>
				{/* This is the Google Map Tracking Page */}
				<pre>{JSON.stringify(this.state.activeShip, null, 2)}</pre>
				<BoatMap
					setActiveShip={this.setActiveShip}
					activeShip={this.state.activeShip}
					handleDropdownChange={this.handleDropdownChange}
					callbackFromParent={this.callbackFromParent}
					shipFromDatabase={this.state.shipFromDatabase}
					renderMyDropDown={this.state.renderMyDropDown}
					// activeWindow={this.setActiveWindow}
				/>
				<SideBar
					// markedShip={images}
					activeShip={this.state.activeShip}
					activeShipTypes={this.state.activeShipTypes}
					shipInfoWithAIS={this.state.ships}
					setActiveShip={this.setActiveShip}
					setShipDatabase={this.setShipDatabase}
				/>
				<ShipTracker
					ships={this.state.ships}
					setActiveShip={this.setActiveShip}
					onMarkerClick={this.handleMarkerClick}
				/>
			</MapContainer>
		);
	}
}
