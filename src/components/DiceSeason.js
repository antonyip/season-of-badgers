import React, {Component} from "react";
import {hot} from "react-hot-loader";

// import images of dice faces
import one from '../images/spring.png';
import two from '../images/summer.png';
import three from '../images/autumn.png';
import four from '../images/winter.png';
import five from '../images/autumn.png';
import six from '../images/winter.png';

class DiceSeason extends Component {
	holdDice = () => {
		this.props.toggleDiceHold(this.props.id);
	}

	render () {
		const diceImages = [one, two, three, four, five, six]
		return (
			<div className={`dice-container ${this.props.hold ? "hold" : "free"}`}>
				<img src={diceImages[this.props.pips]} onClick={this.holdDice} />
			</div>
		)
	}
}
export default hot(module)(DiceSeason);