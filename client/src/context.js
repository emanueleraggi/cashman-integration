import React, { Component } from 'react';
// import items from "./data";
import Client from './Contentful';

// Client.getEntries({
//     content_type: "cashmanVesselTracker"
// }).then(response => console.log(response.items));

const VesselContext = React.createContext();
//

class VesselProvider extends Component {
	state = {
		vessels: [],
		sortedVessels: [],
		featuredVessels: [],
		loading: true,
		type: 'all',
		capacity: 1,
		price: 0,
		minPrice: 0,
		maxPrice: 0,
		minSize: 0,
		maxSize: 0,
		breakfast: false,
		pets: false
	};

	// getData{}
	getData = async () => {
		try {
			let response = await Client.getEntries({
				content_type: 'cashmanVesselTracker'
			});
			let vessels = this.formatData(response.items);
			let featuredVessels = vessels.filter((vessel) => vessel.featured === true);

			let maxPrice = Math.max(...vessels.map((item) => item.price));
			let maxSize = Math.max(...vessels.map((item) => item.size));

			this.setState({
				vessels,
				featuredVessels,
				sortedVessels: vessels,
				loading: false,
				price: maxPrice,
				maxPrice,
				maxSize
			});
		} catch (error) {
			console.log(error);
		}
	};

	// For local data (uncomment to use local data)
	// componentDidMount() {
	//     let vessels = this.formatData(items);
	//     let featuredVessels = vessels.filter(vessel => vessel.featured === true);

	//     let maxPrice = Math.max(...vessels.map(item => item.price));
	//     let maxSize = Math.max(...vessels.map(item => item.size));

	//     this.setState({
	//         vessels,
	//         featuredVessels,
	//         sortedVessels:vessels,
	//         loading: false,
	//         price: maxPrice,
	//         maxPrice,
	//         maxSize
	//     })
	// }

	// For Contentful database data
	componentDidMount() {
		this.getData();
	}

	formatData(items) {
		let tempItems = items.map((item) => {
			let id = item.sys.id;
			let images = item.fields.images.map((image) => image.fields.file.url);

			let vessel = { ...item.fields, images: images, id };

			return vessel;
		});
		return tempItems;
	}

	getVessel = (slug) => {
		let tempVessels = [ ...this.state.vessels ];
		const vessel = tempVessels.find((vessel) => vessel.slug === slug);
		return vessel;
	};

	handleChange = (event) => {
		// We have to do this because we wanted to have the checkbox
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = event.target.name;

		this.setState(
			{
				[name]: value
			},
			this.filterVessels // This is a callback function
		);
	};

	filterVessels = () => {
		let { vessels, type, capacity, price, minSize, maxSize, breakfast, pets } = this.state;

		// all the rooms
		let tempVessles = [ ...vessels ];
		// transform values
		capacity = parseInt(capacity);
		price = parseInt(price);

		// So, if the value for the type, is anything but all, then I do wanna filter it.
		// than I do wanna return the vessels that in fact are matching the vessel type I am passing
		// Filter by type
		if (type !== 'all') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}

		// Filter by capacity
		if (capacity !== 1) {
			tempVessles = tempVessles.filter((vessel) => vessel.capacity >= capacity);
		}

		// Filter by price (or cost of project) : ossia: if we change the price we would like to change
		// the vessels accordingly
		tempVessles = tempVessles.filter((vessel) => vessel.price <= price);

		// Filter by size of the vessel
		tempVessles = tempVessles.filter((vessel) => vessel.size >= minSize && vessel.size <= maxSize);

		// Filter by breackfast
		if (breakfast) {
			tempVessles = tempVessles.filter((vessel) => vessel.breakfast === true);
		}

		// Filter by pets
		if (pets) {
			tempVessles = tempVessles.filter((vessel) => vessel.pets === true);
		}

		// Change state
		this.setState({
			sortedVessels: tempVessles
		});
	};

	render() {
		return (
			<VesselContext.Provider
				value={{
					...this.state,
					getVessel: this.getVessel,
					handleChange: this.handleChange
				}}
			>
				{this.props.children}
			</VesselContext.Provider>
		);
	}
}

const VesselConsumer = VesselContext.Consumer;

export function withVesselConsumer(Component) {
	return function ConsumerWrapper(props) {
		return <VesselConsumer>{(value) => <Component {...props} context={value} />}</VesselConsumer>;
	};
}

export { VesselProvider, VesselConsumer, VesselContext };
