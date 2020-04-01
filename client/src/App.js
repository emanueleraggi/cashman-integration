import React from 'react';
import './App.css';
import './GoogleMap.css';
import './ProgressBar.css';
import Home from "./pages/Home";
import Vessels from "./pages/Vessels";
import SingleVessel from "./pages/SingleVessel";
import Error from "./pages/Error";
import GoogleMap from "./pages/GoogleMap";

import {Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";


// Bodyparser
// app.use(express.urlencoded({ extended: false }));

// Express Session
// app.use(
// 	session({
// 		secret: 'secret',
// 		resave: true,
// 		saveUninitialized: true
// 	})
// );

// Routes


function App() {
  return (
    <>
    <Navbar /> 
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/vessels" component={Vessels}/>
        <Route exact path="/vessels/:slug" component={SingleVessel}/>
        <Route exact path="/map" component={GoogleMap} />
        <Route component={Error} />
      </Switch>
    </>
  );
}

export default App;
