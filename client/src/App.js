import React, { useEffect } from "react"
import THREECanvas from "./components/three/THREECanvas"
import { Route, Switch, useHistory, useLocation } from "react-router-dom"

// Interfaces
import Intro from "./components/interfaces/Intro"
import Galaxy from "./components/interfaces/Galaxy"
import ReviewerDetail from "./components/interfaces/ReviewerDetail"
import { useSelector, useDispatch } from "react-redux"
import { changePage } from "./redux/actions/uiActions"
import Nav from "./components/Nav"

const App = () => {
  const history = useHistory()
  const { pathname } = useLocation()
  const { activePage } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  // when the activePage is changed in store, app will do the routing and change the url accordingly. an alternative would probably be using connect-react-router.
  useEffect(() => {
    if (activePage !== "" && activePage !== pathname) {
      history.push(activePage)
    }
  }, [activePage, history, pathname])

  // on load, change the activePage in store to the current url
  useEffect(() => {
    dispatch(changePage(pathname))
  }, [dispatch, pathname])

  return (
    <div className="app">
      {/* SCENE COMPONENTS */}
      <Switch>
        <Route path="/" exact component={Intro} />
        <Route path="/galaxy" exact component={Galaxy} />
        <Route path="/reviewer/:slug" component={ReviewerDetail} />
      </Switch>
      {/* COMPONENTS ON ALL ROUTES */}
      <Nav />
      <THREECanvas />
    </div>
  )
}

export default App
