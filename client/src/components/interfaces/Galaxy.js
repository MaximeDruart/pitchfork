import React, { useEffect } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { getReviews, setPeriod, setGenres, setScores } from "../../redux/actions/apiActions"
import styled from "styled-components"
import { st } from "../../assets/StyledComponents"
import GalaxySearchBar from "./interfaceChildren/GalaxySearchBar"
import Slider from "@material-ui/core/Slider"
import gsap from "gsap"
import rangeSvg from "../../assets/icons/range.svg"
import dotsSvg from "../../assets/icons/dots.svg"
import { setZoomLevel } from "../../redux/actions/interfaceActions"

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

  const reviews = useSelector((state) => state.api.reviews, shallowEqual)
  const { filteredGenres, filteredScores, allGenres } = useSelector((state) => state.api, shallowEqual)
  // const { filteredGenres, filteredScores, allGenres } = useSelector((state) => state.api, shallowEqual)
  const zoom = useSelector((state) => state.interface.zoom)

  useEffect(() => {
    if (reviews.length === 0) dispatch(getReviews({}, ["review", "role", "bnm", "id"]))
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
    <StyledGalaxy polygon={getClipPath(zoom)}>
      <GalaxySearchBar />
      <div className="scores">
        <div className="scores-title filter-title">ratings</div>
        <div className="filter-selector">{mappedScore()}</div>
      </div>
      <div className="genres">
        <div className="genres-title filter-title">genres</div>
        <div className="filter-selector">{mappedGenres()}</div>
      </div>
      <div className="period">
        <div className="period-start">{getPeriodRange(zoom)[0]}</div>
        <div className="svgs">
          <img className="front" src={rangeSvg} alt="" />
          <img className="low-opac-behind" src={rangeSvg} alt="" />
        </div>
        <Slider className="period-slider" value={zoom} onChange={updatePeriod} />
        <div className="period-end">{getPeriodRange(zoom)[1]}</div>
      </div>
    </StyledGalaxy>
  )
}

const StyledGalaxy = styled.div`
  .scores,
  .genres {
    position: absolute;
    width: 15vw;
    height: 100vh;
    margin-top: 10vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    user-select: none;
  }
  .genres {
    left: 20vw;
  }

  .period {
    position: absolute;
    bottom: 10vh;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 70vw;
    * {
      color: white;
    }
    .svgs img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      &.front {
        clip-path: ${(props) => props.polygon};
      }

      &.low-opac-behind {
        opacity: 0.2;
      }
    }

    .period-slider {
      width: 80%;

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
        &:nth-child(4):before {
          right: 10px;
        }
        &:before {
          content: "";
          position: absolute;
          left: 10px;
          height: 80%;
          width: 25px;
          background-image: url(${dotsSvg});
          background-repeat: no-repeat;
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
