const allGenres = ["Rock", "Rap", "Electronic", "Experimental", "Pop/R&B", "Metal", "Jazz", "Global", "Folk/Country"]
const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let newFiltered

const updateFilteredReviews = ({ reviews, filteredGenres, filteredScores }) => {
  return reviews.filter((review) => {
    if (filteredGenres.includes(review.genre)) {
      if (filteredScores.includes(Math.floor(review.score))) {
        return true
      }
    }
    return false
  })
}

const initialState = {
  loading: false,
  reviews: [],
  reviewsError: "",
  reviewers: [],
  reviewersError: "",
  filteredReviews: [],
  allGenres,
  filteredGenres: allGenres,
  filteredScores: scores,
  filteredPeriod: [0, 100],
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

    case "SET_PERIOD":
      return { ...state, filteredPeriod: action.payload }

    case "SET_GENRES":
      newFiltered = updateFilteredReviews({
        reviews: state.reviews,
        filteredGenres: action.payload,
        filteredScores: state.filteredScores,
      })
      return { ...state, filteredGenres: action.payload, filteredReviews: newFiltered }

    case "SET_SCORES":
      newFiltered = updateFilteredReviews({
        reviews: state.reviews,
        filteredGenres: state.filteredGenres,
        filteredScores: action.payload,
      })
      return { ...state, filteredScores: action.payload, filteredReviews: newFiltered }

    default:
      return state
  }
}

export default apiReducer
