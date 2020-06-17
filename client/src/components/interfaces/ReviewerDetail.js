import React, { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { getReviewers } from "../../redux/actions/apiActions"
import styled from "styled-components"
import { Button } from "../../assets/StyledComponents"

import ReviewersOverlay from "./interfaceChildren/ReviewersOverlay"

const ReviewerDetail = () => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [reviewer, setReviewer] = useState(null)

  const history = useHistory()
  const { reviewers, loading, reviewersError } = useSelector((state) => state.api)
  const { slug } = useParams()
  const dispatch = useDispatch()

  // mongo command is find() so it sends back an array
  useEffect(() => {
    dispatch(getReviewers({}, ["reviewIds"]))
  }, [])

  useEffect(() => {
    if (!loading) {
      // if loading is done and we have reviewers
      if (reviewers.length > 0) {
        // check if the slug in the url corresponds to a reviewer
        let reviewerTemp = reviewers.filter((_reviewer) => _reviewer.slug === slug)[0]
        // if not redirect to a known reviewer page
        if (!reviewerTemp) {
          history.push("/reviewer/andy-beta")
          window.location.reload()
        }
        setReviewer(reviewerTemp)
      } else {
        // error case to handle : loading is done but no reviewers retrieved
      }
    }
  }, [loading])

  useEffect(() => {
    if (reviewersError) {
      // handle server error
    }
  }, [reviewersError])

  return (
    <ReviewerContainer>
      {!loading && reviewers.length > 0 && (
        <ReviewersOverlay setShow={setShowOverlay} show={showOverlay} reviewers={reviewers} />
      )}
      <div className="header">
        <div className="reviewer-name-container">
          <div className="previous"> prev </div>
          {loading ? <div className="name-placeholder"></div> : <div className="name">{reviewer?.name}</div>}
          <div className="next"> next </div>
        </div>
        <Button onClick={() => setShowOverlay(true)} className="see-all-reviewers">
          Show reviewers
        </Button>
      </div>
    </ReviewerContainer>
  )
}

const ReviewerContainer = styled.div``

export default ReviewerDetail
