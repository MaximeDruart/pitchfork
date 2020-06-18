const allGenres = ["Rock", "Rap", "Electronic", "Experimental", "Pop/R&B", "Metal", "Jazz", "Global", "Folk/Country"]

const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const initialState = {
  allGenres,
  filteredGenres: allGenres,
  filteredScores: scores,
  filteredPeriod: [0, 100],
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_PERIOD":
      return { ...state, filteredPeriod: payload }
    case "SET_GENRES":
      return { ...state, filteredGenres: payload }
    case "SET_SCORES":
      return { ...state, filteredScores: payload }

    default:
      return state
  }
}
