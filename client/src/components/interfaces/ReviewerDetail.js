import React, { useEffect, useState, useMemo } from "react"
import { useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { getReviewers } from "../../redux/actions/apiActions"
import styled from "styled-components"
import { Button } from "../../assets/StyledComponents"

import ReviewersOverlay from "./interfaceChildren/ReviewersOverlay"

// Import icons
import nextLeftButton from "../../assets/icons/next-left.svg"
import nextRightButton from "../../assets/icons/next-right.svg"

const ReviewerDetail = () => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [reviewer, setReviewer] = useState(null)
  const dispatch = useDispatch()

  const history = useHistory()
  const { reviewers, loading, reviewersError } = useSelector((state) => state.api)
  const { slug } = useParams()

  // mongo command is find() so it sends back an array
  useEffect(() => {
    // only querying if data isnt already in store
    if (reviewers.length === 0) dispatch(getReviewers({}, ["reviewIds"]))
  }, [dispatch])

  // GETTING URL REVIEWER INFO
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
  }, [loading, history, reviewers, slug])

  useEffect(() => {
    if (reviewersError) {
      // handle server error
    }
  }, [reviewersError])

  const preferedWords = useMemo(
    () => reviewer?.preferedWords.slice(0, 5).map((word) => <span className="word">{word}, </span>),
    [reviewer]
  )

  return (
    <ReviewerContainer>
      {!loading && reviewers.length > 0 && (
        <ReviewersOverlay setShow={setShowOverlay} show={showOverlay} reviewers={reviewers} />
      )}
      <div className="header">
        <div className="reviewer-name-container">
          <div className="previous">
            <a href="#">
              <img src={nextLeftButton}></img>
            </a>
          </div>
          {loading ? <div className="name-placeholder"></div> : <div className="name">{reviewer?.name}</div>}
          <div className="next">
            <a href="#">
              <img src={nextRightButton}></img>
            </a>
          </div>
        </div>
        <Button onClick={() => setShowOverlay(true)} className="see-all-reviewers">
          Show reviewers
        </Button>
      </div>
      <div className="general-infos-container">
        <div className="info">
          <div className="info-title">Favorite Genre</div>
          <div className="info-content">{reviewer?.preferedGenre}</div>
        </div>
        <div className="info">
          <div className="info-title">Number of reviews</div>
          <div className="info-content">{reviewer?.reviewCount}</div>
        </div>
        <div className="info">
          <div className="info-title">Average score</div>
          <div className="average-score-container">
            <div className="info-content">{reviewer?.averageScore}</div>
            <div className="on-ten">/10</div>
          </div>
        </div>
        <div className="align-with-graphs">
          <div className="info">
            <div className="info-title">Most used words</div>
            <div className="info-content used-words">{preferedWords}</div>
          </div>
          <div className="info">
            <div className="info-title">Other graph</div>
          </div>
        </div>
      </div>
    </ReviewerContainer>
  )
}

const ReviewerContainer = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width: 1280px;
    margin: 0 auto;
    padding-bottom: 60px;
    color: white;
    margin-top: 20px;
    .see-all-reviewers {
      width: 240px;
      height: 60px;
      font-size: 16px;
      letter-spacing: 3px;
      background-color: #2c2c2c;
      border: none;
      border-radius: 100px;
    }
  }
  .reviewer-name-container {
    display: flex;
    align-items: center;
    width: 500px;
    .name {
      font-size: 80px;
      margin: 0px 50px;
    }
    .previous,
    .next {
      img {
        height: 30px;
        width: 30px;
        opacity: 0.5;
        transition: 0.8s;
        margin-top: 20px;
      }
      img:hover {
        opacity: 1;
      }
    }
  }
  .general-infos-container {
    display: flex;
    flex-direction: column;
    width: 1280px;
    margin: 0 auto;
    color: white;
    .info {
      margin-bottom: 20px;
    }
    .info-title {
      font-size: 23px;
    }
    .info-content {
      font-size: 55px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .average-score-container {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
    }
    .on-ten {
      font-size: 35px;
    }
    .used-words {
      text-transform: uppercase;
      font-size: 35px;
    }
  }

  .align-with-graphs {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
`

export default ReviewerDetail
