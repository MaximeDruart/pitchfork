const allGenres = ["Rock", "Rap", "Electronic", "Experimental", "Pop/R&B", "Metal", "Jazz", "Global", "Folk/Country"]
const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const initialState = {
  allGenres,
  filteredGenres: allGenres,
  filteredScores: scores,
}

import store from "../configureStore"

const updateFilteredReviews = ({ filteredGenres, filteredScores, filteredSearch }) => {
  const reviews = store.getState().api.reviews
  return reviews.filter((review) => {
    if (filteredGenres.includes(review.genre)) {
      if (filteredScores.includes(Math.floor(review.score))) {
        // if less than 2 chars in searchbar ignore it
        if (filteredSearch.length < 2) return true
        if (
          review.album.toLowerCase().includes(filteredSearch) ||
          review.artist.toLowerCase().includes(filteredSearch)
        ) {
          return true
        }
      }
    }
    return false
  })
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case typeName:
      return { ...state, ...payload }

    default:
      return state
  }
}
