const initialState = {
  loading: false,
  reviews: [],
  reviewsError: "",
  reviewers: [],
  reviewersError: "",
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

    default:
      return state
  }
}

export default apiReducer
