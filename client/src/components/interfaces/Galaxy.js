import React, { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { getReviews, setGenres, setScores } from "../../redux/actions/apiActions"
import styled from "styled-components"
import { st } from "../../assets/StyledComponents"
import GalaxySearchBar from "./interfaceChildren/GalaxySearchBar"
import Slider from "@material-ui/core/Slider"
import gsap from "gsap"
import rangeSvg from "../../assets/icons/range.svg"
import dotsSvg from "../../assets/icons/dots.svg"
import { setZoomLevel } from "../../redux/actions/interfaceActions"
import { useRef } from "react"

const oto10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const getPeriodRange = ([a, b]) => [
  Math.floor(gsap.utils.mapRange(0, 100, 1999, 2019, a)),
  Math.floor(gsap.utils.mapRange(0, 100, 1999, 2019, b)),
]

const getClipPath = (zoom) => {
  const leftStr = zoom[0] + "%"
  const rightStr = zoom[1] + "%"
  return `polygon(${leftStr} 0%, ${rightStr} 0%, ${rightStr} 100%, ${leftStr} 100%)`
}

const Galaxy = () => {
  const dispatch = useDispatch()
  const $genreContainer = useRef(null)
  const $scoreContainer = useRef(null)
  const $period = useRef(null)
  const [spawnAnimDone, setSpawnAnimDone] = useState(false)

  const reviews = useSelector((state) => state.api.reviews, shallowEqual)
  const { filteredGenres, filteredScores, allGenres } = useSelector((state) => state.api, shallowEqual)
  // const { filteredGenres, filteredScores, allGenres } = useSelector((state) => state.api, shallowEqual)
  const zoom = useSelector((state) => state.interface.zoom)

  useEffect(() => {
    const sampleSize = 2000
    if (reviews.length === 0) dispatch(getReviews({}, ["review", "role", "bnm", "id"], sampleSize))
  }, [reviews, dispatch])

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

  const updatePeriod = (event, newValue) => {
    let difference = 20
    let clampedValue = newValue
    // need to restrain the value so the range doesn't get too small
    // if (newValue[1] - difference - newValue[0] < 0) clampedValue = [newValue[0], newValue[1]]
    dispatch(setZoomLevel(clampedValue))
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
    <StyledGalaxy polygon={getClipPath(zoom)}>
      <GalaxySearchBar />
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
      <div ref={$period} className="period">
        <div className="year period-start">
          <span>{getPeriodRange(zoom)[0]}</span>
        </div>
        <div className="svgs">
          <img className="front" src={rangeSvg} alt="" />
          <img className="low-opac-behind" src={rangeSvg} alt="" />
        </div>
        <Slider className="period-slider" value={zoom} onChange={updatePeriod} />
        <div className="year period-end">
          <span>{getPeriodRange(zoom)[1]}</span>
        </div>
      </div>
    </StyledGalaxy>
  )
}

const StyledGalaxy = styled.div`
  .scores,
  .genres {
    position: absolute;
    width: 12vw;
    height: 100vh;
    margin-top: 13vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    user-select: none;
    cursor: pointer;
  }
  .genres {
    left: 15vw;
    align-items: flex-start;
  }

  .period {
    position: absolute;
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 77vw;
    opacity: 0;
    * {
      color: white;
    }
    .year {
      font-size: ${st.fzLarge};
      display: flex;
      justify-content: center;
      align-content: center;
    }

    .svgs img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      &.front {
        clip-path: ${(props) => props.polygon};
      }

      &.low-opac-behind {
        opacity: 0.2;
      }
    }

    .period-slider {
      position: absolute;
      width: 70%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .MuiSlider-rail {
        display: none;
      }
      .MuiSlider-track {
        display: none;
      }

      .MuiSlider-thumb {
        width: 3px;
        height: 60px;
        border-radius: 1px;
        top: 50%;
        transform: translateY(-50%);

        &:before {
          content: "";
          position: absolute;
          right: 10px;
          height: 80%;
          width: 25px;
          background-image: url(${dotsSvg});
          background-repeat: no-repeat;
        }

        &:last-child:before {
          left: 10px;
          right: none;
        }

        &:after {
          content: none;
        }
      }
    }
  }

  .filter-title {
    color: white;
    font-weight: 400;
    margin-bottom: 2vh;
    text-transform: uppercase;
    font-size: ${st.fzMedium};
    letter-spacing: 2px;
  }

  .filter-selector {
    display: flex;
    flex-flow: column-reverse;
  }
`

const StyledScoreItem = styled.div`
  color: white;
  opacity: ${(props) => (props.active ? "1" : "0.5")};
  font-family: ${(props) => (props.active ? "Oswald-Medium" : "Oswald-Light")};
  transition: ${(props) => (props.done ? "all 0.3s ease-in-out;" : "done")};
  font-size: ${st.fzMedium};
  text-align: right;
  cursor: pointer;
  margin-bottom: 20px;
`

const StyledGenreItem = styled.div`
  font-family: ${(props) => (props.active ? "Oswald-Regular" : "Oswald-Regular")};
  color: ${(props) => (props.active ? st.genresColors[props.genre] : st.txtGrey)};
  transition: ${(props) => (props.done ? "all 0.3s ease-in-out;" : "done")};
  font-size: ${st.fzMedium};
  margin-bottom: 20px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export default Galaxy
