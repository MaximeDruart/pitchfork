const initialState = {
  hoveredAlbum: "",
  zoom: [20, 80],
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_HOVERED_ALBUM":
      return { ...state, hoveredAlbum: payload }
    case "SET_ZOOM_LEVEL":
      return { ...state, zoom: payload }

    default:
      return state
  }
}
