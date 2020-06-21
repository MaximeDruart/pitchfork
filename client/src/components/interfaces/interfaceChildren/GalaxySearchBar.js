import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { setSearch } from "../../../redux/actions/apiActions"
import { st } from "../../../assets/StyledComponents"
import search from "../../../assets/icons/search.svg"

const StyledSearchBar = styled.div`
  position: absolute;
  top: 5vh;
  left: 3vw;

  input {
    position: relative;
    width: 100%;
    border: 0;
    border-bottom: 2px solid rgba(255, 255, 255, 0.7);
    outline: 0;
    font-size: ${st.fzSmall};
    color: white;
    padding: 7px 0;
    padding-left: 25px;
    background: transparent;
    transition: all 0.2s;
    text-transform: uppercase;
    font-family: "Oswald-Light";
    letter-spacing: 2px;
    width: 200px;
    &:after {
      content: "";
      background-image: url(${search});
      width: 20px;
      height: 20px;
      background-color: red;
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
    }
    &:focus {
      padding-bottom: 6px;
      border-width: 2px;
      border-image: linear-gradient(to right, $primary, $secondary);
      border-image-slice: 1;
    }
  }
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
      <input placeholder="search for an artist" onChange={inputHandler} value={input} type="text" />
    </StyledSearchBar>
  )
}

export default GalaxySearchBar
