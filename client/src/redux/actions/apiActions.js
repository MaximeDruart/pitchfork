import axios from "axios"

export const fetchReviewsRequest = () => {
  return {
    type: "FETCH_REVIEWS",
    status: "pending",
  }
}

export const fetchReviewsSuccess = (reviews) => {
  return {
    type: "FETCH_REVIEWS",
    status: "success",
    reviews,
  }
}

export const fetchReviewsError = (error) => {
  return {
    type: "FETCH_REVIEWS",
    status: "error",
    error,
  }
}

export const getReviews = (filters = {}, exclusions = []) => {
  return (dispatch) => {
    dispatch(fetchReviewsRequest())
    axios
      .post("http://localhost:3001/reviews/find", {
        filters,
        exclusions,
      })
      .then((response) => {
        dispatch(fetchReviewsSuccess(response.data))
      })
      .catch((error) => {
        dispatch(fetchReviewsError(error))
      })
  }
}
