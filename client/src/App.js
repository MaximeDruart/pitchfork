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

const Logo = styled.div`
  position: fixed;
  right: 5%;
  top: 7%;
  .pitchfork-logo {
    img{
      width: 40px;
      height: 40px;
      color: white;
      opacity: 0.5;
      transition: 0.8s;
      z-index: 10000;
    }
    img:hover{
      opacity: 1;
    }
  }
`

const App = () => {
  const { pathname } = useLocation()

  // const wat

  console.log("running app")
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
          <div className="pitchfork-logo">
            <a href="https://pitchfork.com/" target="_blank"><img src={pitchforkLogo} alt="Pitchfork logo"></img></a>
          </div>
        </Logo>
      </Route>
      <THREECanvas />
      <Music />
    </div>
  )
}

export default App
