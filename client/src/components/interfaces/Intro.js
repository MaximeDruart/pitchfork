import React from "react"
import styled from "styled-components"
import { NavButton } from "../../assets/StyledComponents"

const IntroContainer = styled.div`
  z-index: 10;
  width: 100%;
  padding-left: 10vw;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  * {
    color: white;
  }
  .text-container {
    margin-bottom: 15px;
    .over-title {
      font-family: "Noto Serif", serif;
      font-size: 20px;
    }
    .title {
      font-size: 120px;
      text-transform: uppercase;
      line-height: 1;
      font-family: "Oswald-Bold";
    }
    .under-title {
      font-weight: 200;
      font-size: 28px;
      margin-top: 30px;
      padding-bottom: 30px;
      font-family: "Oswald-Light";
    }
  }
  .intro-button {
  }
`

const Intro = () => {
  return (
    <IntroContainer>
      <div className="text-container">
        <div className="over-title">Pitchfork</div>
        <div className="title">
          reviewing the <br></br> reviews
        </div>
        <div className="under-title">See how the music evolved with pitchfork's reviews</div>
      </div>
      <NavButton to="/galaxy" className="intro-button">
        start the experience
      </NavButton>
    </IntroContainer>
  )
}

export default Intro
