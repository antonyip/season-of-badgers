import React from "react"
import {hot} from "react-hot-loader"
import "../styles/DiceContainer.css"

const GameOver = (props) => {
  return (
    <div className={`game${props.gameOver ? '-over' : ''}`}>
      GAME OVER!
      <br/>
      You've earned {props.tickets} tickets!
    </div>
  )
}

export default hot (module) (GameOver)