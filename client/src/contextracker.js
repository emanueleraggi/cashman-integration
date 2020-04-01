import React, { Component } from 'react';
import Client from './Contentful';

const VesselContext = React.createContext();

class VesselProvider extends Component {
	state = {
		vessels: [],
		sortedVessels: [],
		loading: true,
		type: 'all',
		dayNone: 'None'
	};

	// getData{}
	getData = async () => {
		try {
			let response = await Client.getEntries({
				content_type: 'cashmanCompetitors'
			});
			let vessels = this.formatData(response.items);
			let featuredVessels = vessels.filter((vessel) => vessel.featured === true);

			this.setState({
				vessels,
				featuredVessels,
				sortedVessels: vessels,
				loading: false
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
		let { vessels, type } = this.state;

		let tempVessles = [ ...vessels ];
		// transform values

		// So, if the value for the type, is anything but all, then I do wanna filter it.
		// than I do wanna return the vessels that in fact are matching the vessel type I am passing
		// Filter by type
		if (type !== 'all') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		// Filter by equipment type
		if (type !== 'Bucket') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		if (type !== 'Excavator') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		if (type !== 'Tug') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		if (type !== 'Hopper') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		if (type !== 'Cutter') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		if (type !== 'Crane') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		if (type !== 'Crewboat') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
		}
		if (type !== 'Dustpan') {
			tempVessles = tempVessles.filter((vessel) => vessel.type === type);
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
