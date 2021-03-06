import React, { useMemo, useReducer } from "react"
import styled from "styled-components"

// Import icons
import nextLeftButton from "../../../assets/icons/next-left.svg"
import filterButton from "../../../assets/icons/filter-button-down.svg"
import { useHistory } from "react-router-dom"

const StyledOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  width: 100vw;
  height: 100vh;
  background-color: black;
  overflow-y: scroll;
  overflow-x: hidden;
  z-index: 2000;
  position: fixed;
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
        width: 100%;
        margin: 0 auto;
        text-transform: uppercase;
        font-family: "Oswald-ExtraLight";
        letter-spacing: 4px;
        .filter-group {
          cursor: pointer;
        }
        .right {
          display: flex;
          justify-content: space-between;
          align-self: flex-end;
          font-family: "Oswald-ExtraLight";
          width: 460px;
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
      cursor: pointer;
      text-transform: uppercase;
    }
    .right {
      display: flex;
      justify-content: space-between;
      width: 460px;
      .genre,
      .reviewers {
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

const reducer = (state, action) => {
  switch (action.type) {
    case "SORT_NAME":
      const newState = { ...state }
      newState.sortedName[0] = true
      newState.sortedReviewCount[0] = false
      newState.sortedGenre[0] = false
      if (state.sortedName[1] === 0) {
        newState.sortedName[1] = 1
        newState.reviewers = state.reviewers.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
      } else if (state.sortedName[1] === 1) {
        newState.sortedName[1] = 0
        newState.reviewers = state.reviewers.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA > nameB) return -1
          if (nameA < nameB) return 1
          return 0
        })
      }
      return newState

    case "SORT_REVIEWCOUNT":
      const newState2 = { ...state }
      newState2.sortedName[0] = false
      newState2.sortedReviewCount[0] = true
      newState2.sortedGenre[0] = false
      if (state.sortedReviewCount[1] === 0) {
        newState2.sortedReviewCount[1] = 1
        newState2.reviewers = state.reviewers.sort((revA, revB) => revA.reviewCount - revB.reviewCount)
      } else if (state.sortedReviewCount[1] === 1) {
        newState2.sortedReviewCount[1] = 0
        newState2.reviewers = state.reviewers.sort((revA, revB) => revB.reviewCount - revA.reviewCount)
      }
      return newState2

    case "SORT_GENRE":
      console.log("???", state.sortedGenre)
      const newState3 = { ...state }
      newState3.sortedName[0] = false
      newState3.sortedReviewCount[0] = false
      newState3.sortedGenre[0] = true
      if (state.sortedGenre[1] === 0) {
        newState3.sortedGenre[1] = 1
        newState3.reviewers = state.reviewers.sort((a, b) => {
          const genreA = a.preferedGenre.toUpperCase() // ignore upper and lowercase
          const genreB = b.preferedGenre.toUpperCase() // ignore upper and lowercase
          if (genreA < genreB) return -1
          if (genreA > genreB) return 1
          return 0
        })
      } else if (state.sortedGenre[1] === 1) {
        newState3.sortedGenre[1] = 0
        newState3.reviewers = state.reviewers.sort((a, b) => {
          const genreA = a.preferedGenre.toUpperCase() // ignore upper and lowercase
          const genreB = b.preferedGenre.toUpperCase() // ignore upper and lowercase
          if (genreA > genreB) return -1
          if (genreA < genreB) return 1
          return 0
        })
      }
      console.log(newState3.reviewers)
      return newState3

    default:
      return state
  }
}

const ReviewersOverlay = ({ show, setShow, reviewers }) => {
  const [reviewSort, dispatch] = useReducer(reducer, {
    sortedName: [true, 0],
    sortedReviewCount: [false, 0],
    sortedGenre: [false, 0],
    reviewers,
  })

  const history = useHistory()

  const openReviewer = (slug) => {
    history.push(`/reviewer/${slug}`)
    setShow(false)
  }

  const mappedReviewers = useMemo(
    () =>
      reviewSort.reviewers.map((reviewer) => (
        <StyledAllReviewers key={reviewer._id}>
          <div className="reviewer">
            <div onClick={() => openReviewer(reviewer.slug)} className="left">
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
      )),
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [reviewSort]
  )

  return (
    <StyledOverlay show={show}>
      <div className="header">
        <div className="container">
          <div className="goBack">
            <img alt="" onClick={() => setShow(false)} src={nextLeftButton}></img>
          </div>
          <div className="filters">
            <div className="left">
              <div onClick={() => dispatch({ type: "SORT_NAME" })} className="names filter-group">
                <span>names</span>
                <img alt="" className="filter-button" src={filterButton}></img>
              </div>
            </div>
            <div className="right">
              <div onClick={() => dispatch({ type: "SORT_GENRE" })} className="genres filter-group">
                <span>genres</span>
                <img alt="" className="filter-button" src={filterButton}></img>
              </div>
              <div onClick={() => dispatch({ type: "SORT_REVIEWCOUNT" })} className="reviews filter-group">
                <span>reviews</span>
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
