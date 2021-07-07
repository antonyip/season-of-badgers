import React from "react"
import {hot} from "react-hot-loader"

const RollCount = (props) => {
  return (
    <div className="roll-count">
      <h2>
        ROLLS
        <br/>
        REMAINING
      </h2>
      <h1>
        {3 - props.roll}
      </h1>
    </div>
  )
}

export default hot (module) (RollCount)