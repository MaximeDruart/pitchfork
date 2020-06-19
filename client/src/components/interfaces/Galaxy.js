import React, { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getReviews, setPeriod, setGenres, setScores } from "../../redux/actions/apiActions"
import styled from "styled-components"
import { st } from "../../assets/StyledComponents"

const oto10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const Galaxy = () => {
  const dispatch = useDispatch()

  const { reviews, loading, reviewsError, filteredGenres, filteredScores, filteredReviews, allGenres } = useSelector(
    (state) => state.api
  )

  useEffect(() => {
    if (reviews.length === 0) dispatch(getReviews({}, ["review", "role", "bnm", "id"]))
  }, [reviews, dispatch])

  useEffect(() => {
    if (!loading) {
      // if loading is done and we have reviews
      if (reviews.length > 0) {
      } else {
        // error case to handle : loading is done but no reviews retrieved
      }
    }
  }, [loading, reviews])

  useEffect(() => {
    if (reviewsError) {
      // handle server error
    }
  }, [reviewsError])

  const updateScores = (scoreToUpdate) => {
    let newScores = []
    if (filteredScores.includes(scoreToUpdate)) {
      newScores = filteredScores.filter((_score) => _score !== scoreToUpdate)
    } else {
      newScores = filteredScores
      newScores.push(scoreToUpdate)
    }
    newScores.sort((a, b) => a - b)
    dispatch(setScores(newScores))
  }

  const updateGenres = (genreToUpdate) => {
    let newGenres = []
    if (filteredGenres.includes(genreToUpdate)) {
      newGenres = filteredGenres.filter((_score) => _score !== genreToUpdate)
    } else {
      newGenres = filteredGenres
      newGenres.push(genreToUpdate)
    }
    dispatch(setGenres(newGenres))
  }

  const mappedScore = () =>
    oto10.map((score, index) => (
      <StyledScoreItem
        active={filteredScores.includes(score)}
        onClick={() => updateScores(score)}
        key={index}
        className="score-item"
      >
        {score}
      </StyledScoreItem>
    ))

  const mappedGenres = () =>
    allGenres.map((genre, index) => (
      <StyledGenreItem
        genre={genre}
        active={filteredGenres.includes(genre)}
        onClick={() => updateGenres(genre)}
        key={index}
        className="score-item"
      >
        {genre}
      </StyledGenreItem>
    ))

  return (
    <StyledGalaxy>
      <div className="scores">
        <div className="scores-title filter-title">ratings</div>
        <div className="filter-selector">{mappedScore()}</div>
      </div>
      <div className="genres">
        <div className="genres-title filter-title">genres</div>
        <div className="filter-selector">{mappedGenres()}</div>
      </div>
      <div className="period"></div>
    </StyledGalaxy>
  )
}

const StyledGalaxy = styled.div`
  .scores,
  .genres {
    position: absolute;
    width: 15vw;
    height: 100vh;
    margin-top: 5vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    user-select: none;
  }
  .genres {
    left: 20vw;
  }

  .filter-title {
    color: white;
    font-weight: 400;
    margin-bottom: 1vh;
    text-transform: uppercase;
    font-size: ${st.fzLarge};
  }

  .filter-selector {
    display: flex;
    flex-flow: column-reverse;
  }
`

const StyledScoreItem = styled.div`
  color: white;
  opacity: ${(props) => (props.active ? "1" : "0.5")};
  font-size: ${st.fzMedium};
  text-align: right;
  cursor: pointer;
`

const StyledGenreItem = styled.div`
  color: ${(props) => (props.active ? st.genresColors[props.genre] : st.txtGrey)};
  font-size: ${st.fzMedium};
  cursor: pointer;
`

export default Galaxy
