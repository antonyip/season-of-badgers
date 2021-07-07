import React, { Component } from "react";
import {hot} from "react-hot-loader";
import "./styles/app.css";
import DiceContainer from './containers/DiceContainer.js';

class App extends Component {
	render() {
		return (
			<div className="App">
				<h1 align="center">Seasons of Badgers</h1>
				<div align="center">Click the dice to lock them</div>
				<DiceContainer />
			</div>
		);
	}
}

export default hot(module)(App);