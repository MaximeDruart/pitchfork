import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { setSearch } from "../../../redux/actions/apiActions"

const StyledSearchBar = styled.div`
  position: absolute;
  top: 5vw;
  left: 5vw;
`

const GalaxySearchBar = () => {
  const [input, setInput] = useState("")
  const dispatch = useDispatch()

  const inputHandler = ({ target }) => {
    setInput(target.value)
    dispatch(setSearch(input))
  }

  return (
    <StyledSearchBar>
      <input onChange={inputHandler} value={input} type="text" />
    </StyledSearchBar>
  )
}

export default GalaxySearchBar
