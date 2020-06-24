import React, { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { getReviews, setGenres, setScores } from "../../redux/actions/apiActions"
import styled, { keyframes, css } from "styled-components"
import { st } from "../../assets/StyledComponents"
import GalaxySearchBar from "./interfaceChildren/GalaxySearchBar"
import gsap from "gsap"
import { useRef } from "react"
import mouseSvg from "../../assets/icons/mouse.svg"

const oto10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const Galaxy = () => {
  const dispatch = useDispatch()
  const $genreContainer = useRef(null)
  const $scoreContainer = useRef(null)
  const $period = useRef(null)
  const [spawnAnimDone, setSpawnAnimDone] = useState(false)

  const reviews = useSelector((state) => state.api.reviews, shallowEqual)
  const { filteredGenres, filteredScores, allGenres, sampleSize } = useSelector((state) => state.api, shallowEqual)
  const hasInteractedWithCanvas = useSelector((state) => state.interface.hasInteractedWithCanvas)

  useEffect(() => {
    if (reviews.length === 0) {
      dispatch(getReviews({}, ["review", "role", "bnm", "id"], sampleSize))
    }
  }, [reviews, dispatch, sampleSize])

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

  const toggleAllScores = () => (filteredScores.length < 11 ? dispatch(setScores(oto10)) : dispatch(setScores([])))
  const toggleAllGenres = () =>
    filteredGenres.length < allGenres.length ? dispatch(setGenres(allGenres)) : dispatch(setGenres([]))

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
        done={spawnAnimDone}
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
        done={spawnAnimDone}
        genre={genre}
        active={filteredGenres.includes(genre)}
        onClick={() => updateGenres(genre)}
        key={index}
        className="score-item"
      >
        {genre}
      </StyledGenreItem>
    ))

  useLayoutEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const tl = gsap
      .timeline({ onComplete: () => setSpawnAnimDone(true) })
      .addLabel("sync")
      .from(
        $genreContainer.current.childNodes,
        {
          opacity: 0,
          stagger: {
            amount: 0.4,
          },
          duration: 2,
        },
        "sync"
      )
      .from(
        $scoreContainer.current.childNodes,
        {
          opacity: 0,
          stagger: {
            amount: 0.4,
          },
          duration: 2,
        },
        "sync"
      )
      .to($period.current, { ease: "Power2.easeIn", opacity: 1, duration: 0.6 }, "sync")
  }, [])

  return (
    <StyledGalaxy loaded={!!reviews.length} int={hasInteractedWithCanvas}>
      <GalaxySearchBar />
      <div className="help">click and drag to discover</div>
      <div className="scores">
        <div onClick={toggleAllScores} className="scores-title filter-title">
          ratings
        </div>
        <div ref={$scoreContainer} className="filter-selector">
          {mappedScore()}
        </div>
      </div>
      <div className="genres">
        <div onClick={toggleAllGenres} className="genres-title filter-title">
          genres
        </div>
        <div ref={$genreContainer} className="filter-selector">
          {mappedGenres()}
        </div>
      </div>
    </StyledGalaxy>
  )
}

const shinekf = keyframes`
  from {opacity : 0.42};
  to {opacity : 0.64};
`

const shine = () =>
  css`
    ${shinekf} 1.4s ease alternate infinite;
  `

const StyledGalaxy = styled.div`
  .help {
    position: absolute;
    font-family: "Oswald-Light";
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    text-transform: uppercase;
    opacity: ${(p) => (p.int ? 0 : !p.loaded ? 0 : 0.6)};
    transition: opacity 0.7s 0.4s ease-in-out;
    pointer-events: none;

    &:after {
      content: "";
      position: absolute;
      right: -34px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      background: no-repeat center url(${mouseSvg});
      animation: ${shine};
    }
  }
  .scores,
  .genres {
    position: absolute;
    width: 12vw;
    height: 100vh;
    margin-top: 18vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    user-select: none;
    cursor: pointer;
  }
  .genres {
    left: 11vw;
    align-items: flex-start;
  }
  .scores {
    left: 4vw;
    align-items: flex-start;
  }

  .filter-title {
    color: white;
    font-family: "Oswald-Light";
    margin-bottom: 4vh;
    text-transform: uppercase;
    font-size: ${st.fzSmall};
    letter-spacing: 2px;
  }

  .filter-selector {
    display: flex;
    flex-flow: column-reverse;
  }
`

const StyledScoreItem = styled.div`
  color: ${(props) => (props.active ? "white" : "#868686")};
  opacity: ${(props) => (props.active ? "1" : "0.5")};
  font-family: ${(props) => (props.active ? "Oswald-Medium" : "Oswald-Light")};
  transition: ${(props) => (props.done ? "all 0.3s ease-in-out;" : "done")};
  font-size: ${st.fzMedium};
  text-align: left;
  cursor: pointer;
  margin-bottom: 20px;
`

const StyledGenreItem = styled.div`
  font-family: ${(props) => (props.active ? "Oswald-Medium" : "Oswald-Regular")};
  color: ${(props) => (props.active ? st.genresColors[props.genre] : st.txtGrey)};
  transition: ${(props) => (props.done ? "all 0.3s ease-in-out;" : "done")};
  font-size: ${st.fzMedium};
  margin-bottom: 20px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export default Galaxy
