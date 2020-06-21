import React from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledPopup = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  border: 1px solid red;
  width: 30vw;
  height: 30vh;
  background: black;
  color: white;
  z-index: 100;
  position: absolute;
  right: 0;
`

const GalaxyPopup = () => {
  const { hoveredAlbum } = useSelector((state) => state.interface)
  return (
    <StyledPopup show={!!hoveredAlbum}>
      <img className="album-cover" src="" alt="" />
      <div className="text-container">
        <div className="album-name">{hoveredAlbum?.album}</div>
        <div className="album-artist">{hoveredAlbum?.artist}</div>
        <div className="reviewer">
          Reviewed by {hoveredAlbum?.author} on {hoveredAlbum?.date}
        </div>
        <div className="score">{hoveredAlbum?.score}</div>
        <a href={hoveredAlbum ? hoveredAlbum.link : "#"}>Read on pitchfork</a>
      </div>
    </StyledPopup>
  )
}

export default GalaxyPopup
