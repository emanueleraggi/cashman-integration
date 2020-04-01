import React from 'react';
import Vessel from "./Vessel";

export default function VesselList({vessels}) {
    if(vessels.length === 0) {
        return (
            <div className="empty-search">
                <h3>No vessels matched your search</h3>
            </div>
        );
    }
    return (
        <section className="roomslist">
            <div className="roomslist-center">
                { vessels.map(item => {
                        return <Vessel key = {item.id} vessel = {item} />
                    })
                }
            </div>
        </section>
    );
}
