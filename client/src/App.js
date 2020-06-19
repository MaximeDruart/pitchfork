import React, { useEffect } from "react"
import THREECanvas from "./components/three/THREECanvas"
import { Route, Switch, useLocation } from "react-router-dom"

// Interfaces
import Intro from "./components/interfaces/Intro"
import Galaxy from "./components/interfaces/Galaxy"
import ReviewerDetail from "./components/interfaces/ReviewerDetail"
import { useSelector } from "react-redux"
import Nav from "./components/Nav"
import GalaxyPopup from "./components/interfaces/interfaceChildren/GalaxyPopup"

const App = () => {
  const { pathname } = useLocation()
  const { hoveredAlbum } = useSelector((state) => state.interface)

  return (
    <div className="app">
      {/* SCENE COMPONENTS */}
      <Switch>
        <Route path="/" exact component={Intro} />
        <Route path="/galaxy" exact component={Galaxy} />
        <Route path="/reviewer/:slug" component={ReviewerDetail} />
      </Switch>
      {/* COMPONENTS ON ALL ROUTES */}
      {hoveredAlbum && <GalaxyPopup review={hoveredAlbum} />}
      {pathname !== "/" && <Nav />}
      <THREECanvas />
    </div>
  )
}

export default App
