import React, { useEffect } from "react"
import THREECanvas from "./components/three/THREECanvas"
import { Route, Switch, useHistory, useLocation } from "react-router-dom"

// Interfaces
import Intro from "./components/interfaces/Intro"
import Galaxy from "./components/interfaces/Galaxy"
import ReviewerDetail from "./components/interfaces/ReviewerDetail"
import { useSelector, useDispatch } from "react-redux"
import Nav from "./components/Nav"

const App = () => {
  const history = useHistory()
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const location = useLocation()

  return (
    <div className="app">
      {/* SCENE COMPONENTS */}
      <Switch>
        <Route path="/" exact component={Intro} />
        <Route path="/galaxy" exact component={Galaxy} />
        <Route path="/reviewer/:slug" component={ReviewerDetail} />
      </Switch>
      {/* COMPONENTS ON ALL ROUTES */}
      {location.pathname !== "/" && <Nav />}
      <THREECanvas />
    </div>
  )
}

export default App
