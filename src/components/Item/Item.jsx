import React from 'react'
import "./style.css"

const Item = ({ data, handleClick }) => {

  return (
    <span onClick={() => handleClick(data)}>{data.name}</span>
  )
}

export default Item