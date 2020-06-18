import React from "react"
import { changePage } from "../../redux/actions/uiActions"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { Button } from "../../assets/StyledComponents"

const IntroContainer = styled.div`
  z-index: 10;
  width: 100%;
  padding-left: 10vw;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  .text-container {
    margin-bottom: 15px;
    .over-title {
    }
    .title {
      font-size: 120px;
      text-transform: uppercase;
      line-height: 1;
    }
    .under-title {
    }
  }
  .intro-button {
  }
`

const Intro = () => {
  const dispatch = useDispatch()
  return (
    <IntroContainer>
      <div className="text-container">
        <div className="over-title">Pitchfork</div>
        <div className="title">
          reviewing the <br></br> reviews
        </div>
        <div className="under-title">see how the music evolved with pitchfork's reviews</div>
      </div>
      <Button onClick={() => dispatch(changePage("/galaxy"))} className="intro-button">
        start the experience
      </Button>
    </IntroContainer>
  )
}

export default Intro
