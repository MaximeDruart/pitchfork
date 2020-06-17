const initialState = {
  loading: false,
  reviews: [],
  error: "",
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
            loading: false,
            reviews: action.reviews,
            error: "",
          }

        case "error":
          return {
            loading: false,
            reviews: [],
            error: action.error,
          }

        default:
          return state
      }

    default:
      return state
  }
}

export default apiReducer
