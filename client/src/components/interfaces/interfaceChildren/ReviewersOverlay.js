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
  background-color: #0c0a17;
  overflow: scroll;
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
        .right {
          display: flex;
          justify-content: space-between;
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
  console.log("dispatched")
  switch (action.type) {
    case "SORT_NAME":
      const newState = { ...state }
      newState.sortedName[0] = true
      newState.sortedReviewCount[0] = false
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
      if (state.sortedReviewCount[1] === 0) {
        console.log("asc count")
        newState2.sortedReviewCount[1] = 1
        newState2.reviewers = state.reviewers.sort((revA, revB) => revA.reviewCount - revB.reviewCount)
      } else if (state.sortedReviewCount[1] === 1) {
        console.log("desc count")
        newState2.sortedReviewCount[1] = 0
        newState2.reviewers = state.reviewers.sort((revA, revB) => revB.reviewCount - revA.reviewCount)
      }
      console.log(state, newState2)
      return newState2

    default:
      return state
  }
}

const ReviewersOverlay = ({ show, setShow, reviewers }) => {
  const [reviewSort, dispatch] = useReducer(reducer, {
    sortedName: [true, 0],
    sortedReviewCount: [false, 0],
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
    [reviewSort, openReviewer]
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
              <span>names</span>
              <img
                onClick={() => dispatch({ type: "SORT_NAME" })}
                alt=""
                className="filter-button"
                src={filterButton}
              ></img>
            </div>
            <div className="right">
              <div>
                <span>reviews</span>
                <img
                  onClick={() => {
                    dispatch({ type: "SORT_REVIEWCOUNT" })
                    console.log("click !")
                  }}
                  alt=""
                  className="filter-button"
                  src={filterButton}
                ></img>
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
