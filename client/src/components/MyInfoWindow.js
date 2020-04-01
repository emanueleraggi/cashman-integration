import React, { Component } from 'react';
import { shipCompanyMap } from "../components/ShipTracker"
// import Chart from 'chart.js'
// import { withGoogleMap, GoogleMap, Polyline  } from 'react-google-maps'
import { Parser } from 'json2csv'
import { CSVLink } from "react-csv"
import '../components/ShipTracker.css';

export class MyInfoWindowWidget extends Component {
    static defaultProps = {
        trajectoryColor: {
            '1 hour': 'green',
            '6 hours': 'orange',
            '12 hours': 'yellow',
            '1 day': 'blue',
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            currentShipName: null,
            currentShipImage: null,
            bigImageURL: null,
            currentLogo: null,
            showCanvas: false,
            currentSelectName: 'None',
            trajectoryCSVData: [],
        };
        this.json2csv = new Parser();
        this.trajectoryCSV = []; // for intermediate use to avoid blank file event state has been changed
        this.trajectoryData = [];
        this.updateShipData(this.props);    
    }

    componentWillReceiveProps = (nextprops) => {
        if (this.props.ship !== null && nextprops.ship !== null) {
            if (this.props.ship.AIS.NAME !== nextprops.ship.AIS.NAME) {
                this.setState({currentSelectName: 'None'})
            }
        } else {
            this.setState({currentSelectName: 'None'})
        }
        if (this.props !== nextprops) {
            this.updateShipData(nextprops);
        }
    }

    updateShipData = (nextprops) => {
        if (nextprops.ship !== null) {
            const shipName = nextprops.ship.AIS.NAME;
            const company = shipCompanyMap[shipName];
            const logoImg = nextprops.logoMap[company && company.split(' ').join('').toUpperCase()];
            let foundHoverOnShip = this.filterFromShipDatabase(shipName)
            if (foundHoverOnShip === null) {
                console.log("Did not find match for ", shipName)
                return null
            }
            this.setState({ 
                currentShipName: shipName, 
                currentShipImage: foundHoverOnShip.images.fields.file.url,
                bigImageURL: foundHoverOnShip.images.fields.file.url,
                currentLogo: logoImg,
                showCanvas: false,
            })
        }
    }

    extractCSVHandler = (event, done) => {
        if (this.state.currentSelectName === 'None') {
            alert('Please select a time interval.')
            return false;
        }
        if (!this.trajectoryData || this.trajectoryData.length === 0) {
            alert('No data available in this interval.')
            return false;
        }
        this.setState({trajectoryCSVData: this.trajectoryCSV});
        done();
    }

    filterFromShipDatabase = (shipName) => {
        let foundHoverOnShip = this.props.shipFromDatabase.filter(
            (ship) => shipName.toLowerCase() === ship.name.toLowerCase());
        if (foundHoverOnShip.length === 0) {
            return null
        }
        return foundHoverOnShip[0] // return the first match
    }

    selectHandler = async (event) => {
        const offset = event.target.value;
        this.setState({ currentSelectName: offset })
        if (offset === 'None') {
            this.setState({ showCanvas: false })
            this.props.setTrajectoryData([], 'black');
            return null;
        }

        const response = await fetch('http://localhost:3001/users/vessles/map/latlngdata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: this.state.currentShipName,
                offset: offset,
            }),
        });

        response.json().then((data) => {
            const _data = (!data) ? [] : data.reduce((acc, d) => [...acc, {'lng': d.longitude, 'lat': d.latitude, 'date': d.date}], []);
            this.trajectoryData = _data;
            if (_data.length === 0) {
                console.log('No data retrieved!');
                this.setState({ showCanvas: true }); // plot empty chart
                this.props.setTrajectoryData([], 'black');
                this.trajectoryCSV = [];
                return null;
            }
            this.trajectoryCSV = this.json2csv.parse(_data)
            this.setState({trajectoryCSVData: this.trajectoryCSV})
            // console.log("1", _data)
            // console.log("2", this.trajectoryCSV)
            this.setState({ 
                showCanvas: true, 
                currentSelectName: offset })
    
            let color = this.props.trajectoryColor[offset]
            this.props.setTrajectoryData(_data, color);
        }).catch(err => console.log(err))
    }

    render() {
        if (this.state.currentShipName === null) {
            console.log("Did not found match!!!")
            return null
        }
        if (this.props.show) {
            const shipName = this.state.currentShipName;
            const logoImage = this.state.currentLogo;
            const largeImage = this.state.currentShipImage;
            return (
                <div className='infowindow' onMouseOver={this.props.keepInfoWindow} onMouseLeave={this.props.closeInfoWindow} >
                    <div className='infowindow-header'>
                        <img src={logoImage} alt="Logo" width="20px" height = "20px"/> {"     "} {shipName}
                    </div>
                    <div className='infowindow-img'>
                        <img width="170px" height="120px"
                            src={largeImage}
                            alt="shipImage"/>    
                    </div>
                    <div className='infowindow-footer'>
                        <div className='infowindow-p'>
                            <p>Latitude: {this.props.ship.AIS.LATITUDE}</p>
                            <p>Longitude: {this.props.ship.AIS.LONGITUDE}</p>
                        </div>
                        <select className='infowindow-select' value={this.state.currentSelectName} onChange={this.selectHandler}>
                            <option value='None'>None</option>
                            <option value='1 hour'>1 hour</option>
                            <option value='6 hours'>6 hours</option>
                            <option value='12 hours'>12 hours</option>
                            <option value='1 day'>1 day</option>
                        </select>
                        <CSVLink data={this.state.trajectoryCSVData} className='infowindow-button' 
                            filename={this.props.ship.AIS.NAME} target="_blank" onClick={this.extractCSVHandler} asyncOnClick={true}>
                            Extract CSV
                        </CSVLink>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }
}

// class SmallMap extends Component {
//     static defaultProps = {
//         googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBm59I3P5VB3JR25MWz-GKgf4PZs8XEsqc?v=3.exp&libraries=geometry,drawing,places",
//     }

//     constructor(props) {
//         super(props);
//     }

//     CMap = withGoogleMap(props => {
//         console.log("1234", props);
//         const latlng = props.children.props.path 
//         return (<GoogleMap
//             defaultZoom={9}
//             defaultCenter={{ 
//                 lat: (latlng[0].lat + latlng[latlng.length-1].lat) / 2, 
//                 lng: (latlng[0].lng + latlng[latlng.length-1].lng) / 2 }}
//         >
//             {props.children}
//         </GoogleMap>)}
//     );

//     render = () => {
//         return (
//             <Fragment>
//                 <this.CMap
//                     googleMapURL={this.props.googleMapURL}
//                     loadingElement={<div style={{ height: `100%` }} />}
//                     containerElement={<div style={{ height: `700px` }} />}
//                     mapElement={<div style={{ height: `100%` }} />}
//                 >
//                     <Polyline
//                         path={this.props.trajectoryData}
//                     />
//                 </this.CMap>
//             </Fragment>
//         );
//     }
// }
