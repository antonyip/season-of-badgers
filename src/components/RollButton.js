import React, { Component } from "react";
import {hot} from "react-hot-loader";
import "../styles/DiceContainer.css";

const RollButton = (props) => {
	return (
		<button id="roll-btn"
			className={`roll-button${props.roll === 3? ' reroll' : ''}`}
			onClick={props.handleRollClick}>
			{props.gameOver ? 'NEW GAME' 
			: (props.roll === 3? 'REROLL!' : 'ROLL!')}
		</button>
	)
}

export default hot (module)(RollButton);