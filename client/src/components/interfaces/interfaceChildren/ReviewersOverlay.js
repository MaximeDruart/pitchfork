import React from "react"
import styled from "styled-components"

// Import icons
import nextLeftButton from "../../../assets/icons/next-left.svg"
import { useHistory } from "react-router-dom"

const StyledOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  height: 100vh;
  .container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 1100px;
    .filters {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      width: 1100px;
      margin: 0 auto;
      text-transform: uppercase;
      font-weight: 300;
      letter-spacing: 4px;
      .right {
        display: flex;
        justify-content: space-between;
        width: 400px;
        align-self: flex-end;
      }
    }
  }
  .goBack {
    img {
      height: 25px;
      width: 25px;
      color: white;
      cursor: pointer;
      margin-top: 30px;
      margin-bottom: 50px;
    }
  }

  .reviewers {
    .reviewer {
    }
  }
`

const StyledAllReviewers = styled.div`
  .reviewer {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 1100px;
    margin: 0 auto;
    padding: 25px 0px;
    color: white;
    font-size: 25px;
    letter-spacing: 2px;
    .left {
      font-weight: 500;
    }
    .right {
      display: flex;
      justify-content: space-between;
      width: 400px;
      text-align: right;
      .genre,
      .reviews {
        font-weight: 200;
      }
    }
  }
  .section {
    width: 1100px;
    height: 1px;
    margin: 0 auto;
    background: linear-gradient(90deg, rgba(124, 27, 248, 1) 0%, rgba(248, 40, 78, 1) 100%);
  }
`

const ReviewersOverlay = ({ show, setShow, reviewers }) => {
  const history = useHistory()
  const mappedReviewers = reviewers.map((reviewer) => (
    <StyledAllReviewers key={reviewer._id}>
      <div className="reviewer">
        <div onClick={() => history.push(`/reviewer/${reviewer.slug}`)} className="left">
          {reviewer.name}
        </div>
        <div className="right">
          <div className="genre">{reviewer.preferedGenre}</div>
          <div className="reviews">{reviewer.reviewCount} reviews </div>
        </div>
      </div>
      <div className="section"></div>
    </StyledAllReviewers>
  ))
  return (
    <StyledOverlay show={show}>
      <div className="header">
        <div className="container">
          <div className="goBack">
            <img onClick={() => setShow(false)} src={nextLeftButton}></img>
          </div>
          <div className="filters">
            <div className="left">filter names</div>
            <div className="right">
              <div>select genres</div>
              <div>number of reviews</div>
            </div>
          </div>
        </div>
      </div>
      <div className="reviewers">{mappedReviewers}</div>
    </StyledOverlay>
  )
}

export default ReviewersOverlay
