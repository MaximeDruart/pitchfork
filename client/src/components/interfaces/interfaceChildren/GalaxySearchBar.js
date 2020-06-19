import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"

const StyledSearchBar = styled.div``

const GalaxySearchBar = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState("")
  const inputHandler = ({ target }) => {
    setInput(target.value)
  }
  return (
    <StyledSearchBar>
      <input onChange={inputHandler} value={input} type="text" />
    </StyledSearchBar>
  )
}

export default GalaxySearchBar
