import React from "react"
import THREECanvas from "./components/three/THREECanvas"
import { Route, Switch, useLocation } from "react-router-dom"

// Interfaces
import Intro from "./components/interfaces/Intro"
import Galaxy from "./components/interfaces/Galaxy"
import ReviewerDetail from "./components/interfaces/ReviewerDetail"
import Nav from "./components/Nav"
import GalaxyPopup from "./components/interfaces/interfaceChildren/GalaxyPopup"
import Credits from "./components/interfaces/Credits"
import Music from "./components/Music"
import styled from "styled-components"

// Import icons
import pitchforkLogo from "./assets/icons/logo-pitchfork.svg"
import twitterLogo from "./assets/icons/twitter.svg"

const Logo = styled.div`
  position: fixed;
  right: 5vw;
  top: 7vh;
  display: flex;
  .pitchfork-logo {
    img {
      width: 40px;
      height: 40px;
      color: white;
      opacity: 0.5;
      transition: 0.8s;
      z-index: 10000;
    }
    img:hover {
      opacity: 1;
    }
  }
  .twitter-link {
    margin-right: 15px;
  }
`

const App = () => {
  const { pathname } = useLocation()

  return (
    <div className="app">
      {/* SCENE COMPONENTS */}
      <Switch>
        <Route path="/" exact component={Intro} />
        <Route path="/galaxy" exact component={Galaxy} />
        <Route path="/reviewer/:slug" component={ReviewerDetail} />
        <Route path="/credits" exact component={Credits} />
      </Switch>
      {/* COMPONENTS ON ALL ROUTES */}
      <GalaxyPopup />
      {pathname !== "/" && <Nav />}
      <Route exact path={["/", "/galaxy", "/credits"]}>
        <Logo>
          <div className="twitter-link pitchfork-logo">
            <a
              rel="noopener noreferrer"
              href="https://twitter.com/intent/tweet?text=Check%20out%20Pitchfork%27s%20data%20visualization%20for%20its%2025%20year%20anniversary%20%21%0D%0Ahttps%3A%2F%2Fpitchfork.herokuapp.com%2F"
              target="_blank"
            >
              <img src={twitterLogo} alt="Pitchfork logo"></img>
            </a>
          </div>
          <div className="pitchfork-logo">
            <a rel="noopener noreferrer" href="https://pitchfork.com/" target="_blank">
              <img src={pitchforkLogo} alt="Pitchfork logo"></img>
            </a>
          </div>
        </Logo>
      </Route>
      <THREECanvas />
      <Music />
    </div>
  )
}

export default App
