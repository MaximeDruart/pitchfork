import React from "react"
import { changePage } from "../../redux/actions/uiActions"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { Button } from "../../assets/StyledComponents"

const IntroContainer = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10;
`

const Intro = () => {
  const dispatch = useDispatch()
  return (
    <IntroContainer>
      <div className="text-container">
        <div className="over-title">Pitchfork</div>
        <div className="title">reviewing the reviews</div>
        <div className="under-title">see how the music evolved with pitchfork's reviews</div>
      </div>
      <Button onClick={() => dispatch(changePage("/galaxy"))} className="over-title">
        start the experience
      </Button>
    </IntroContainer>
  )
}

export default Intro
