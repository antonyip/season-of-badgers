import React, { Component } from "react"
import {hot} from "react-hot-loader"
import RollButton from "../components/RollButton.js"
import RollCount from "../components/RollCount.js"
import Dice from "../components/Dice.js"
import DiceSeason from "../components/DiceSeason.js"
import GameOver from "../components/GameOver.js"
import TableContainer from "./TableContainer.js"
import "../styles/DiceContainer.css"

class DiceContainer extends Component {
	state = {
		roll: 0,
		pips: [0,0,0,0,0,0],
		hold: [false, false, false, false, false, false],
		rollClicked: true,
		tableClicked: false,
		gameOver: false,
		tickets: 0,
	}

	gameOver = () => {
		this.setState({gameOver: true})
	}

	// (callback from Dice.js)
	toggleDiceHold = (id) => {
		if (this.state.roll !== 0) {
			let holds = this.state.hold
			holds[id] = !holds[id]
			this.setState({hold: holds})
		}
	}

	// (callback from TableContainer.js)
	handleTableChange = () => {
		this.setState({tableClicked: true, rollClicked: false, roll: 3})
	}

	// (callback from RollButton.js)
	handleRollClick = () => {
		if (this.state.gameOver) {
			this.newGame()
		} else if (this.state.roll === 3 && this.state.tableClicked) {
			this.newTurn()
		} else if (this.state.roll != 3) {
			this.newRoll()
		}
	}

	newGame = () => {
		this.setState({
			roll: 0,
			pips: [0,0,0,0,0,0],
			hold: [false, false, false, false, false],
			rollClicked: true,
			tableClicked: false,
			gameOver: false,
			tickets: 0,
		})
	}

	newTurn = () => {
		this.setState({ roll: 1,
			hold: [false, false, false, false, false],
			rollClicked: true,
			tableClicked: false }, 
			() => {this.rollDice()})
	}

	newRoll = () => {
		const rollCount = this.state.roll
		this.setState({roll: rollCount + 1})
		this.rollDice()
	}

	rollDice = () => {
		let newPips = [...this.state.pips];
		for (let i = 0; i <6; i++){
			if (!this.state.hold[i]) {
				const num = Math.floor(Math.random() * 6)
				newPips[i] = num
			}
		}
		this.setState({pips: newPips})
	}

	render () {
		return (
			<div className="app-container">
				<div className="dice-area">
					<div className="dice-bar">
						<Dice id={0} pips={this.state.pips[0]} hold={this.state.hold[0]} toggleDiceHold={this.toggleDiceHold} />
						<Dice id={1} pips={this.state.pips[1]} hold={this.state.hold[1]} toggleDiceHold={this.toggleDiceHold} />
						<Dice id={2} pips={this.state.pips[2]} hold={this.state.hold[2]} toggleDiceHold={this.toggleDiceHold} />
						<Dice id={3} pips={this.state.pips[3]} hold={this.state.hold[3]} toggleDiceHold={this.toggleDiceHold} />
						<Dice id={4} pips={this.state.pips[4]} hold={this.state.hold[4]} toggleDiceHold={this.toggleDiceHold} />
						<DiceSeason id={5} pips={this.state.pips[5]} hold={this.state.hold[5]} toggleDiceHold={this.toggleDiceHold} />
					</div>	
				<div>
				<div className = "roll-area">
					<div className="roll-canvas">
						<GameOver gameOver={this.state.gameOver} tickets={this.state.tickets}/>
						<RollButton roll={this.state.roll} 
												handleRollClick={this.handleRollClick} 
												gameOver={this.state.gameOver}/>
						<RollCount roll={this.state.roll} />
					</div>
				</div>
				<div align="center">Score tickets by locking in your score.</div>
				<br></br>
				<TableContainer pips={this.state.pips} 
												roll={this.state.roll} 
												handleTableChange={this.handleTableChange}
												rollClicked={this.state.rollClicked}
												tableClicked={this.state.tableClicked}
												gameOver={this.gameOver} />
					</div>
				</div>
			</div>
		)
	}
}

export default hot (module)(DiceContainer);