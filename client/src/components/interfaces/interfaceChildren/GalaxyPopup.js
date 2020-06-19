import React from "react"
import styled from "styled-components"

const StyledPopup = styled.div`
  border: 1px solid red;
  width: 30vw;
  height: 30vh;
  background: black;
  color: white;
  z-index: 100;
`

const GalaxyPopup = ({ review }) => {
  return (
    <StyledPopup>
      <img className="album-cover" src="" alt="" />
      <div className="text-container">
        <div className="album-name">{review.album}</div>
        <div className="album-artist">{review.artist}</div>
        <div className="reviewer">
          Reviewed by {review.author} on {review.date}
        </div>
        <div className="score">{review.score}</div>
        <a href={review.link}>Read on pitchfork</a>
      </div>
    </StyledPopup>
  )
}

export default GalaxyPopup
