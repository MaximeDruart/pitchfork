import React from "react"
import styled from "styled-components"
import { NavButton } from "../../assets/StyledComponents"

// Import icons 
import pitchforkLogo from "../../assets/icons/logo-pitchfork.svg"

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
    a {
      text-decoration: none;
      cursor: pointer;
    }
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
  .over-title a{
    display: flex;
    align-items: center;
    cursor: pointer;
    img{
      width: 20px;
      height: 20px;
      margin-right: 10px;
      z-index: 1000;
    }
    p{
      margin: 0;
      z-index: 1000;
    }
  }
  .intro-button {
  }
`

const Intro = () => {
  return (
    <IntroContainer>
      <div className="text-container">
        <div className="over-title">
          <a href="https://pitchfork.com/" target="_blank">
            <img src={pitchforkLogo} alt="Pitchfork logo"></img>
            <p>Pitchfork</p>
          </a>
        </div>
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
