import apiReducer from "./apiReducer"
import uiReducer from "./uiReducer"
import galaxyReducer from "./galaxyReducer"
import { combineReducers } from "redux"

export default combineReducers({
  api: apiReducer,
  ui: uiReducer,
  galaxy: galaxyReducer,
})
