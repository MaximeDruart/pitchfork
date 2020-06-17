import { createStore } from "redux"
import rootReducer from "./reducers"
import { applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

export default createStore(
  rootReducer,
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
)
