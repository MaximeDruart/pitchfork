import apiReducer from "./apiReducer"
import uiReducer from "./uiReducer"
import { combineReducers } from "redux"

export default combineReducers({
  api: apiReducer,
  ui: uiReducer,
})
