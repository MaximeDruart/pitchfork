const initialState = {
  hoveredAlbum: "",
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_HOVERED_ALBUM":
      return { ...state, hoveredAlbum: payload }

    default:
      return state
  }
}
