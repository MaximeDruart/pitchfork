import React from "react"
import "./main.scss"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"

import store from "./redux/configureStore"
import App from "./App"

const AppWrap = () => (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
)

export default AppWrap
