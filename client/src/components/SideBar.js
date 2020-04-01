import React from 'react';
import { Card, CardTitle, CardSubtitle, CardText, CardBody, CardImg, Row } from 'reactstrap';
import '../components/SideBar.css';
// import { Link } from 'react-router-dom';
import Client from '../Contentful';
import SearchVessel from '../components/SearchVessel';
// import { FaSearch } from 'react-icons/fa';

// import example2 from '../documents/example1.pdf';

// class SpecsButton extends React.Component {
// 	render() {
// 		return <DownloadLink src={example2}>Project Notes</DownloadLink>;
// 	}
// }
// class DownloadLink extends React.Component {
// 	render() {
// 		return (
// 			<form method="get" action={this.props.src}>
// 				<button type="submit" class="btn mr-3">
// 					{this.props.children}
// 				</button>
// 			</form>
// 		);
// 	}
// }

class Sidebar extends React.Component {
	state = {
		ships: [],
		searchText: [],
		// services: [
		// 	{
		// 		icon: <FaSearch />
		// 	}
		// ]
	};

	async componentDidMount() {
		let response = await Client.getEntries({
			content_type: 'cashmanCards'
		});
		const ships = response.items.map((item) => {
			const {
				name,
				slug,
				type,
				company,
				description,
				images,
				companylogo,
				projectnotes,
				abstract,
				locationmap,
				distancesandcontours,
				borrowareainfo,
				solicitation,
				specifications,
				amendments,
				plans,
				addendum
			} = item.fields;
			return {
				name,
				slug,
				type,
				company,
				description,
				images,
				companylogo,
				projectnotes,
				abstract,
				locationmap,
				distancesandcontours,
				borrowareainfo,
				solicitation,
				specifications,
				amendments,
				plans,
				addendum
			};
		});

		this.setState({
			ships: ships
		});
		this.props.setShipDatabase(ships)
	}

	// shouldComponentUpdate() {
	// 	console.log(this.props.markedShip);
	// }

	getFilteredShips = () => {
		if (!this.props.activeShip) {
			return this.state.ships;
		}
		// only ship that appear at the top
		let targetShip = this.state.ships.filter(
			// (ship) => this.props.activeShip.name.toLowerCase() === ship.name.toLowerCase()
			(ship) => this.props.activeShip.name === ship.name
		);
		// all ships
		let otherShipsArray = this.state.ships.filter((ship) => this.props.activeShip.name !== ship.name);
		return targetShip.concat(otherShipsArray);
	};

	handleChange = (e) =>{
		this.setState({
			searchText : e.target.value
		});
	};

	handleSubmit = (e) =>{
		// stop whole page refresh
		e.preventDefault();
		if (this.props.shipInfoWithAIS.length !== 0){
			let foundActiveShip = this.props.shipInfoWithAIS.filter(
				(ship) => this.state.searchText.toLowerCase() === ship.AIS.NAME.toLowerCase());
			console.log("search result: ", foundActiveShip)
			let foundActiveShipData = foundActiveShip[0]
			if (typeof(foundActiveShipData) === 'undefined'){
				alert('Not found!')
			}
			else {
				this.props.setActiveShip(foundActiveShipData.AIS.NAME, foundActiveShipData.AIS.LATITUDE, foundActiveShipData.AIS.LONGITUDE)
			}
		}
	}


	render() {
		// const { value, handleSubmit, handleChnage } = this.props;

		return (
			<div className="map-sidebar">
				{this.props.activeShipTypes}
				<SearchVessel 
				  value = {this.state.searchText}
				  handleSubmit = {this.handleSubmit}
				  handleChange = {this.handleChange}
				/>
				<pre>
					{this.getFilteredShips().map((ship) => {
						// console.log(ship);
						return (
							<Card className="mb-2">
								<CardImg />
								<CardBody>
									<div className="row">
										{/* <div className="column"> */}
										<img
											className="image-sizing-primary"
											src={ship.companylogo.fields.file.url}
											alt="shipImage"
										/>
									</div>
									<div>
										<img
											className="image-sizing-secondary"
											src={ship.images.fields.file.url}
											alt="shipImage"
										/>
									</div>
									<CardTitle>
										<h3 className="thick">{ship.name}</h3>
										{/* <Link to={`/vessels/${ship.slug}`} className="btn btn-primary  mr-3">
											Go To Vessel For Further Technical Details
										</Link> */}
									</CardTitle>
									<CardSubtitle>{ship.type}</CardSubtitle>
									<CardText>
										<br />
										<h6>Project Details</h6>
										<p>For a description of the project view the specification included</p>
									</CardText>
									{/* <div className="btn-toolbar"> */}
									{/* <a href="http://localhost:5000" className="btn  mr-3">
			Go To Specs
		</a> */}
									{/* <Link to={`/vessels/${ship.slug}`} className="btn  mr-3">
			Go to vessels
		</Link>
		<Link to={`/vessels/${ship.slug}`} className="btn ">
			...
		</Link> */}
									{/* <Button className="btn mr-3">Project Notes</Button>
		<Button className="btn mr-3">Plans</Button> */}
									{/* <Row> */}
									<Row style={{ marginTop: '20px' }}>
										<div className="buttoncontainer">
											<div className="btn btn-cards">
												<a
													className="buttonLink"
													download
													href={ship.projectnotes.fields.file.url}
												>
													Project Notes
												</a>
											</div>
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.abstract.fields.file.url}>
													Abstract
												</a>
											</div>
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.locationmap.fields.file.url}>
													Location Map
												</a>
											</div>
											<div className="btn btn-cards">
												<a
													className="buttonLink"
													href={ship.distancesandcontours.fields.file.url}
												>
													Dist and Contours
												</a>
											</div>
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.plans.fields.file.url}>
													Plans
												</a>
											</div>
										</div>
									</Row>
									<Row style={{ marginTop: '20px' }}>
										<div className="buttoncontainer">
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.borrowareainfo.fields.file.url}>
													Borrow Area Info
												</a>
											</div>
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.solicitation.fields.file.url}>
													Solicitation
												</a>
											</div>
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.specifications.fields.file.url}>
													Specs
												</a>
											</div>
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.amendments.fields.file.url}>
													Amendmenmets
												</a>
											</div>
											<div className="btn btn-cards">
												<a className="buttonLink" href={ship.addendum.fields.file.url}>
													Addendum
												</a>
											</div>
										</div>
									</Row>

									{/* <Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Abstract
				</a>
			</Col>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Location Map
				</a>
			</Col>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Distances and Contours
				</a>
			</Col>
		</Row>
		<Row style={{ marginTop: '20px' }}>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Borrow Area Info
				</a>
			</Col>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Solicitation
				</a>
			</Col>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Specification
				</a>
			</Col>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Amendments
				</a>
			</Col>
		</Row>
		<Row style={{ marginTop: '20px' }}>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					Plans
				</a>
			</Col>
			<Col>
				<a class="btn btn-primary" role="button" href={example2}>
					...
				</a>
			</Col> */}
									{/* </Row> */}
									{/* </div> */}
								</CardBody>
							</Card>
						);
					})}
				</pre>
			</div>
		);
	}
}

export default Sidebar;
