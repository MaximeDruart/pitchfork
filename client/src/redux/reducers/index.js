import apiReducer from "./apiReducer"
import { combineReducers } from "redux"
import interfaceReducer from "./interfaceReducer"

export default combineReducers({
  api: apiReducer,
  interface: interfaceReducer,
})
