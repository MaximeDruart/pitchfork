import React from "react"
import styled from "styled-components"

const StyledOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  width: 100vw;
  height: 100vh;
  .filters {
  }

  .reviewers {
    .reviewer {
    }
  }
`

const ReviewersOverlay = ({ show, setShow, reviewers }) => {
  const mappedReviewers = reviewers.map((reviewer) => (
    <div key={reviewer._id} className="reviewer">
      <div className="left">{reviewer.name}</div>
      <div className="right">
        <div className="genre">{reviewer.preferedGenre}</div>
        <div className="reviews">{reviewer.reviewCount}</div>
      </div>
    </div>
  ))
  return (
    <StyledOverlay show={show}>
      <div className="header">
        <div onClick={() => setShow(false)} className="goBack">
          go back
        </div>
        <div className="filters"></div>
      </div>
      <div className="reviewers">{mappedReviewers}</div>
    </StyledOverlay>
  )
}

export default ReviewersOverlay
