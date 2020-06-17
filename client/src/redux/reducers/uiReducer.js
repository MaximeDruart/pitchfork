const initialState = {
  activePage: "",
}

export default (state = initialState, { type, page }) => {
  switch (type) {
    case "CHANGE_PAGE":
      return {
        ...state,
        activePage: page,
      }

    default:
      return state
  }
}
