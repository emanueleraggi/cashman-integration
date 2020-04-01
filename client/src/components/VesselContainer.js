import React from 'react'
import VesselsFilter from "./VesselFilter"
import VesselsList from "./VesselList"
import {withVesselConsumer} from "../context"
import Loading from "./Loading"


function VesselContainer({context}) {
    const {loading, sortedVessels, vessels} = context;
        if(loading) {
            return <Loading />;
        }

        return (
            <>
            <VesselsFilter vessels = {vessels} />
            <VesselsList vessels = {sortedVessels} />
            </>
        );
}



export default withVesselConsumer(VesselContainer)


// import React from 'react'
// import VesselsFilter from "./VesselFilter"
// import VesselsList from "./VesselList"
// import {VesselConsumer} from "../context"
// import Loading from "./Loading"


// export default function VesselContainer() {
//     return (
//         <VesselConsumer>
//             {
//                 (value) => {
//                     const {loading, sortedVessels, vessels} = value;
//                     if(loading) {
//                         return <Loading />;
//                     }
                    
//                     return (
//                         <div>
//                         This is from Vessels Continer
//                         <VesselsFilter vessels = {vessels} />
//                         <VesselsList vessels = {sortedVessels} />
//                         </div>
//                     );
//                 }
//             }
//         </VesselConsumer>
//     );
// }
