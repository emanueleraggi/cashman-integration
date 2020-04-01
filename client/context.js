import React, { Component } from 'react'

const VesselContext = React.createContext();
// 

export default class VesselProvider extends Component {
state = {
    vessels:[],
    sortedVessels: [],
    featuredVessels: [],
    loading: true
}

    render() {
        return (
        <VesselContext.Provider value ={"hello"}>
            {this.props.children}
        </VesselContext.Provider>
        );
    }
}

const VesselConsumer = VesselContext.Consumer;
export{VesselProvider, VesselConsumer, VesselContext};