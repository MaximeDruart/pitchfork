const initialState = {
  hoveredAlbum: "",
  albumPosition: [0, 0],
  hasInteractedWithCanvas: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_HOVERED_ALBUM":
      return { ...state, hoveredAlbum: payload }
    case "SET_ALBUM_POSITION":
      return { ...state, albumPosition: payload }
    case "SET_CANVAS_INTERACTION":
      return { ...state, hasInteractedWithCanvas: true }

    default:
      return state
  }
}
