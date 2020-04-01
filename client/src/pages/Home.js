import React from 'react'
import Hero from "../components/Hero"
import Banner from "../components/Banner"
import {Link} from "react-router-dom"
import Services from "../components/Services"
import FeaturedVessel from "../components/FeaturedVessels"

export default function Home () {
    return (
    <>
    <Hero hero="defaultHero">
        <Banner title="Vessels" subtitle="Currently Tracked Vessels">
            <Link to="/vessels" className="btn-primary">
                Vessels
            </Link>
        </Banner>
    </Hero>
    <Services />
    <FeaturedVessel />

    </>

    );
}

// Hero.defaultProps = {
//     hero: "defaultHero"
// };

