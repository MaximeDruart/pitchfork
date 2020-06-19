import React from "react"
import THREECanvas from "./components/three/THREECanvas"
import { Route, Switch, useLocation } from "react-router-dom"

// Interfaces
import Intro from "./components/interfaces/Intro"
import Galaxy from "./components/interfaces/Galaxy"
import ReviewerDetail from "./components/interfaces/ReviewerDetail"
import Nav from "./components/Nav"
import GalaxyPopup from "./components/interfaces/interfaceChildren/GalaxyPopup"

const App = () => {
  const { pathname } = useLocation()

  return (
    <div className="app">
      {/* SCENE COMPONENTS */}
      <Switch>
        <Route path="/" exact component={Intro} />
        <Route path="/galaxy" exact component={Galaxy} />
        <Route path="/reviewer/:slug" component={ReviewerDetail} />
      </Switch>
      {/* COMPONENTS ON ALL ROUTES */}
      <GalaxyPopup />
      {pathname !== "/" && <Nav />}
      <THREECanvas />
    </div>
  )
}

export default App
