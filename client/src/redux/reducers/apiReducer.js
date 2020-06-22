const allGenres = ["Rock", "Rap", "Electronic", "Experimental", "Pop/R&B", "Metal", "Jazz", "Global", "Folk/Country"]
const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let newFiltered

const updateFilteredReviews = ({ reviews, filteredGenres, filteredScores, filteredSearch }) => {
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

const initialState = {
  loading: false,
  reviews: [],
  reviewsError: "",
  filteredReviews: [],
  reviewers: [],
  reviewersError: "",
  activeReviewer: "",
  allGenres,
  filteredGenres: allGenres,
  filteredScores: scores,
  filteredSearch: "",
  sampleSize: 2000,
}

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_REVIEWS":
      switch (action.status) {
        case "pending":
          return {
            ...state,
            loading: true,
          }

        case "success":
          console.log("returning reviews")
          return {
            ...state,
            loading: false,
            reviews: action.reviews,
            filteredReviews: state.filteredReviews.length > 0 ? state.filteredReviews : action.reviews,
            reviewsError: "",
          }

        case "error":
          return {
            ...state,
            loading: false,
            reviews: [],
            reviewsError: action.error,
          }

        default:
          return state
      }

    case "FETCH_REVIEWERS":
      switch (action.status) {
        case "pending":
          return {
            ...state,
            loading: true,
          }

        case "success":
          return {
            ...state,
            loading: false,
            reviewers: action.reviewers,
          }

        case "error":
          return {
            ...state,
            loading: false,
            reviewersError: action.error,
          }

        default:
          return state
      }

    case "SET_ACTIVE_REVIEWER":
      return { ...state, activeReviewer: action.payload }

    case "SET_GENRES":
      newFiltered = updateFilteredReviews({
        reviews: state.reviews,
        filteredSearch: state.filteredSearch,
        filteredGenres: action.payload,
        filteredScores: state.filteredScores,
      })
      return { ...state, filteredGenres: action.payload, filteredReviews: newFiltered }

    case "SET_SCORES":
      newFiltered = updateFilteredReviews({
        reviews: state.reviews,
        filteredSearch: state.filteredSearch,
        filteredGenres: state.filteredGenres,
        filteredScores: action.payload,
      })
      return { ...state, filteredScores: action.payload, filteredReviews: newFiltered }

    case "SET_SEARCH":
      newFiltered = updateFilteredReviews({
        reviews: state.reviews,
        filteredSearch: action.payload,
        filteredGenres: state.filteredGenres,
        filteredScores: state.filteredScores,
      })
      return { ...state, filteredSearch: action.payload, filteredReviews: newFiltered }

    default:
      return state
  }
}

export default apiReducer
