import axios from "axios"

// getting reviews

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
export const getReviews = (filters = {}, exclusions = [], sampleSize = 8500) => {
  return (dispatch) => {
    dispatch(fetchReviewsRequest())
    axios
      .post("http://localhost:3001/reviews/find/agg", {
        exclusions,
        sampleSize,
      })
      // .post("http://localhost:3001/reviews/find", {
      //   filters,
      //   exclusions,
      //   limit: limit,
      // })
      .then((response) => {
        dispatch(fetchReviewsSuccess(response.data))
      })
      .catch((error) => {
        dispatch(fetchReviewsError(error.response))
      })
  }
}

// getting reviewers

export const setActiveReviewer = (payload) => ({
  type: "SET_ACTIVE_REVIEWER",
  payload,
})

export const fetchReviewersRequest = () => {
  return {
    type: "FETCH_REVIEWERS",
    status: "pending",
  }
}
export const fetchReviewersSuccess = (reviewers) => {
  return {
    type: "FETCH_REVIEWERS",
    status: "success",
    reviewers,
  }
}
export const fetchReviewersError = (error) => {
  return {
    type: "FETCH_REVIEWERS",
    status: "error",
    error,
  }
}
export const getReviewers = (filters = {}, exclusions = []) => {
  return (dispatch) => {
    dispatch(fetchReviewersRequest())
    axios
      .post("http://localhost:3001/reviewers/find", {
        filters,
        exclusions,
      })
      .then((response) => {
        dispatch(fetchReviewersSuccess(response.data))
      })
      .catch((error) => {
        dispatch(fetchReviewersError(error.response))
      })
  }
}

// filtering reviews

export const setPeriod = (payload) => ({
  type: "SET_PERIOD",
  payload,
})

export const setGenres = (payload) => ({
  type: "SET_GENRES",
  payload,
})

export const setScores = (payload) => ({
  type: "SET_SCORES",
  payload,
})

export const setSearch = (payload) => {
  console.log("action triggered")
  return {
    type: "SET_SEARCH",
    payload,
  }
}
