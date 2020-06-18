import React, { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

import { getReviews } from "../../redux/actions/apiActions"
import { setPeriod, setGenres, setScores } from "../../redux/actions/galaxyActions"
import styled from "styled-components"

const oto10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const Galaxy = () => {
  const dispatch = useDispatch()

  const { reviews, loading, reviewsError } = useSelector((state) => state.api)
  const { allGenres, filteredGenres, scores, filteredScores, filteredPeriod } = useSelector((state) => state.galaxy)

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
    allGenres.map((score, index) => (
      <StyledGenreItem
        active={filteredScores.includes(score)}
        onClick={() => updateScores(score)}
        key={index}
        className="score-item"
      >
        {score}
      </StyledGenreItem>
    ))

  return (
    <StyledGalaxy>
      <div className="scores">{mappedScore()}</div>
      <div className="genres">{mappedGenres()} </div>
      <div className="period"></div>
    </StyledGalaxy>
  )
}

const StyledGalaxy = styled.div``
const StyledScoreItem = styled.div`
  border: ${(props) => (props.active ? "1px solid red" : "1px solid grey")};
  width: 30px;
  height: 30px;
`

const StyledGenreItem = styled.div`
  border: ${(props) => (props.active ? "1px solid red" : "1px solid grey")};
  width: 30px;
  height: 30px;
`

export default Galaxy
