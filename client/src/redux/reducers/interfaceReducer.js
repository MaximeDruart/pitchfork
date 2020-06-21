const initialState = {
  hoveredAlbum: "",
  albumPosition: [0, 0],
  zoom: [50, 60],
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_HOVERED_ALBUM":
      return { ...state, hoveredAlbum: payload }
    case "SET_ZOOM_LEVEL":
      return { ...state, zoom: payload }
    case "SET_ALBUM_POSITION":
      return { ...state, albumPosition: payload }

    default:
      return state
  }
}
