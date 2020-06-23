import React from "react"
import styled from "styled-components"

// Import icons
import nextLeftButton from "../../../assets/icons/next-left.svg"
import filterButton from "../../../assets/icons/filter-button-down.svg"
import { useHistory } from "react-router-dom"

const StyledOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  width: 100vw;
  height: 100vh;
  background-color: #0c0a17;
  overflow: scroll;
  .header {
    margin-bottom: 15px;
    .container {
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      width: 1100px;
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
      .filters {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        width: 1100px;
        margin: 0 auto;
        text-transform: uppercase;
        font-family: "Oswald-ExtraLight";
        letter-spacing: 4px;
        .right {
          display: flex;
          justify-content: space-between;
          width: 460px;
          align-self: flex-end;
          font-family: "Oswald-ExtraLight";
          .genres-filter {
            padding-bottom: 5px;
            border-bottom: 1px solid white;
          }
        }
        img {
          width: 13px;
          height: 13px;
          margin-left: 16px;
          color: white;
          cursor: pointer;
        }
      }
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
      font-weight: 600;
    }
    .right {
      display: flex;
      justify-content: space-between;
      width: 460px;
      .genre,
      .reviews {
        font-family: "Oswald-ExtraLight";
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
          <div className="reviews">
            {reviewer.reviewCount} review{reviewer.reviewCount > 1 && "s"}
          </div>
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
            <img alt="" onClick={() => setShow(false)} src={nextLeftButton}></img>
          </div>
          <div className="filters">
            <div className="left">
              filter names
              <img alt="" className="filter-button" src={filterButton}></img>
            </div>
            <div className="right">
              <div className="genres-filter">
                select genres
                <img alt="" className="filter-button" src={filterButton}></img>
              </div>
              <div>
                number of reviews
                <img alt="" className="filter-button" src={filterButton}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="reviewers">{mappedReviewers}</div>
    </StyledOverlay>
  )
}

export default ReviewersOverlay
