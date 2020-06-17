import apiReducer from "./apiReducer"
import { combineReducers } from "redux"

export default combineReducers({
  api: apiReducer,
})
