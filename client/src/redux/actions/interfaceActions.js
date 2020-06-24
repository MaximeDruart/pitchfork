export const setHoveredAlbum = (payload) => ({
  type: "SET_HOVERED_ALBUM",
  payload,
})

export const setZoomLevel = (payload) => ({
  type: "SET_ZOOM_LEVEL",
  payload,
})

export const setAlbumPosition = (payload) => ({
  type: "SET_ALBUM_POSITION",
  payload,
})

export const setCanvasInteraction = (payload = true) => ({
  type: "SET_CANVAS_INTERACTION",
  payload,
})
