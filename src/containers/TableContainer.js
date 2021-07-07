import React, { Component } from "react"
import {hot} from "react-hot-loader"
import Rows from "../components/Rows.js"
import UpperSums from "../components/UpperSums.js"
import LowerSums from "../components/LowerSums.js"
import Modal from "../components/Modal.js"
import "../styles/ScoreTable.css"

class TableContainer extends Component {
  state = {
    active: [false, false, false, false, false, false, false,
      false, false, false, false, false, false],
    potential: [0,0,0,0,0,0,0,0,0,0,0,0,0],
    filled: [false, false, false, false, false, false, false,
      false, false, false, false, false, false],
    score: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    cell_id: null,
    modalTrigger: false,
    modalMessage: '',
    whatDiceDoIHave: {}
  }

  handleCellClick = (cell_id) => {
    if (this.cellIsClickable(cell_id)) {
      if (this.props.roll < 3 || this.state.potential[cell_id] === 0 ) {
        this.setState({ cell_id: cell_id }, () => {this.setModalMessage()})
      } else {
        this.setState({ cell_id: cell_id }, () => {this.toggleCell()})
      }
    }
  }

  cellIsClickable = (cell_id) => {
    return (this.props.roll !== 0 && !this.props.tableClicked && !this.state.filled[cell_id])
  }

  setModalMessage = () => {
    const { cell_id, potential } = this.state
    if (this.props.roll < 3 ) {
      let message = 'Are you sure you want to end your turn? You can still roll again.'
      potential[cell_id] === 0 && 
        (message += ' (This will result in a score of zero for this item.)')
      this.setState({modalMessage: message},() => {this.openModal()})
    } else if (this.otherCellsHavePotential()) {
      this.setState({modalMessage: 'Are you sure you want to put a zero here? You could score more points elsewhere.'}, 
                     () => {this.openModal()})
    } else {this.toggleCell()}
  }

  otherCellsHavePotential = () => {
    for (let i = 0; i < 15; i++) {
      if (!this.state.filled[i] && this.state.potential[i]) {
        return true
      }
    }
  }

  openModal = () => { this.setState({modalTrigger: true})}

  closeModal = () => { this.setState({ modalTrigger: false})}

  submitModal = () => { 
    this.setState({ modalTrigger: false})
    this.toggleCell(this.state.cell_id)
  }

  toggleCell = () => {
    const { filled, score, cell_id, potential } = this.state
    this.props.rollClicked && 
      (filled[cell_id] = true, score[cell_id] = potential[cell_id])
    this.setState ({ filled: filled, score: score })
    this.props.handleTableChange()
  }

	componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      if (this.props.roll === 0) {
        this.resetTable()
      } else if (this.props.pips !== prevProps.pips) {
        this.organizeDice()
      } else if (this.props.tableClicked !== prevProps.tableClicked) {
        this.checkComplete()
      }
    }
  }

  resetTable = () => {
    this.setState({
      active: [false, false, false, false, false, false, false,
        false, false, false, false, false, false],
      potential: [0,0,0,0,0,0,0,0,0,0,0,0,0],
      filled: [false, false, false, false, false, false, false,
        false, false, false, false, false, false],
      score: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      cell_id: null,
      modalTrigger: false,
      modalMessage: '',
      whatDiceDoIHave: {}
    })
  }
  
  checkComplete = () => {
    !this.state.filled.includes(false) && this.props.gameOver()
  }

  organizeDice = () => {
    let whatDiceDoIHave = {}
    this.props.pips.forEach(dice => { whatDiceDoIHave[dice] = (whatDiceDoIHave[dice] || 0)+1})
    this.setState({ whatDiceDoIHave: whatDiceDoIHave }, () => this.activateLowerCells())    
  }
    
  activateLowerCells = () => {
    let newActive = [];
    newActive[6] = this.props.pips[5] === 0;
    newActive[7] = this.props.pips[5] === 1;
    newActive[8] = this.props.pips[5] === 2 ||this.props.pips[5] === 4;
    newActive[9] = this.props.pips[5] === 3 ||this.props.pips[5] === 5;
    newActive[10] = this.anyFiveConsecutive()
    newActive[11] = this.anyQuintuples()
    newActive[12] = true;
    this.calculateLowerValues(newActive)
  }

  anyPairs = () => {
    return Object.values(this.state.whatDiceDoIHave).includes(2)
  }

  anyTriples = () => {
    return Object.values(this.state.whatDiceDoIHave).includes(3)
  }

  anyQuadruples = () => {
    return Object.values(this.state.whatDiceDoIHave).includes(4)
  }

  anyQuintuples = () => {
    return Object.values(this.state.whatDiceDoIHave).includes(5)
  }

  anyFourConsecutive = () => {
    let sortedPips = Object.keys(this.state.whatDiceDoIHave)
    return (sortedPips.length === 5) && (sortedPips[4] - sortedPips[1] === 3 || sortedPips[3] - sortedPips[0] === 3) 
                                     || (sortedPips.length === 4 && sortedPips[3] - sortedPips[0] === 3)
  }

  anyFiveConsecutive = () => {
    let sortedPips = Object.keys(this.state.whatDiceDoIHave)
    return sortedPips.length === 5 && (sortedPips[4] - sortedPips[0] === 4)
  }

  calculateLowerValues = (newActive) => {
    let newPotential = []
    let diceSum = (this.props.pips.reduce((sum, pips) =>  sum + pips)) + 5 
    newPotential[6] = (newActive[6] ? diceSum : 0)
    newPotential[7] = (newActive[7] ? diceSum : 0)
    newPotential[8] = (newActive[8] ? diceSum : 0)
    newPotential[9] = (newActive[9] ? diceSum : 0)
    newPotential[10] = (newActive[10] ? 25 : 0)
    newPotential[11] = (newActive[11] ? 25 : 0)
    newPotential[12] = diceSum
    this.calculateUpperValues(newActive, newPotential)
  }

  calculateUpperValues = (newActive, newPotential) => {
    for (let i = 0; i <= 5; i++) {
			let numberOfDice = this.props.pips.filter(x => x===i).length;
      this.props.pips.includes(i) ? (newActive[i] = true, newPotential[i] = numberOfDice*(i+1)) 
                                  : (newActive[i] = false, newPotential[i] = 0 )
    }
    this.updateTable(newActive, newPotential)
  }

  updateTable = (newActive, newPotential) => {
    this.setState({
      active: newActive,
      potential: newPotential,
    })
  }

  render() {
    return (
      <div className="scorecard-canvas">
        <Modal modalTrigger={this.state.modalTrigger} 
               closeModal={this.closeModal}
               submitModal={this.submitModal}
               message={this.state.modalMessage} />
        <table className="upper-scorecard">
          <th colSpan="2">Upper Section</th>
          <th>Score</th>
          <tbody>
            <Rows items={UPPER_ITEMS}
                  active={this.state.active}
                  potential={this.state.potential}
                  filled={this.state.filled}
                  score={this.state.score}
                  toggleCell={this.handleCellClick} />
            <UpperSums score={this.state.score} filled={this.state.filled}/>
            </tbody>
        </table>
        <table className="lower-scorecard">
          <th colSpan="2">Lower Section</th>
          <th>Score</th>
           <tbody>
            <Rows items={LOWER_ITEMS}
                  active={this.state.active}
                  potential={this.state.potential}
                  filled={this.state.filled}
                  score={this.state.score}
                  toggleCell={this.handleCellClick} />
            <LowerSums score={this.state.score} filled={this.state.filled}/>
            </tbody>
        </table>
      </div>
    )
  }
}

const UPPER_ITEMS = [
  {name: 'Aces', description: 'Total of all Aces', index: 0},
  {name: 'Twos', description: 'Total of all Twos', index: 1},
  {name: 'Threes', description: 'Total of all Threes', index: 2},
  {name: 'Fours', description: 'Total of all Fours', index: 3},
  {name: 'Fives', description: 'Total of all Fives', index: 4},
  {name: 'Sixes', description: 'Total of all Sixes', index: 5},
]

const LOWER_ITEMS = [
  {name: 'Best Spring Season', description: 'Total of all Dice in Spring', index: 6},
  {name: 'Best Summer Season', description: 'Total of all Dice in Summer', index: 7},
  {name: 'Best Autumn Season', description: 'Total of all Dice in Winter', index: 8},
  {name: 'Best Winter Season', description: 'Total of all Dice in Autumn', index: 9},
  {name: 'Straight', description: '1,2,3,4,5 or 2,3,4,5,6', index: 10},
  {name: '5 of a Kind', description: '5 of the same numbers', index: 11},
  {name: 'Best Season', description: 'Total of All Dice', index: 12},
]

export default hot (module)(TableContainer);