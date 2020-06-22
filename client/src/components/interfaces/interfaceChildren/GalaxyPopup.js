import React from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledPopup = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  color: white;
  z-index: 100;
  position: absolute;
  right: 0;
  .popup-container{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 30vw;
    min-height: 20vh;
    .album-cover{
      background: blue;
      width: 160px;
      border-radius: 10px 0px 0px 10px;
    }
    .text-container {
      width: 267px;
      background-color: rgba(52, 53, 73, 0.6);
      border-radius: 0px 10px 10px 0px;
      padding: 10px 30px;
      
      .album-name {
        font-family: "Oswald-Bold";
        font-size: 20px;
      }
      .album-artist {
        font-family: "Oswald-Medium";
      }
      .reviewer {
        font-family: "Oswald-Light";
        font-size: 15px;
        .author-review{
          font-family: "Oswald-Regular";
        }
      }
      .score {
        
      }
      .pitchfork-link {
        font-family: "Oswald-Regular";
        text-decoration: underline;
        color: white;
    }
  }
  
`

const GalaxyPopup = () => {
  const { hoveredAlbum } = useSelector((state) => state.interface)
  return (
    <StyledPopup show={!!hoveredAlbum}>
      <div className="popup-container">
        <img className="album-cover" src="" alt="" />
        <div className="text-container">
          <div className="album-name">{hoveredAlbum?.album}</div>
          <div className="album-artist">{hoveredAlbum?.artist}</div>
          <div className="reviewer">
            Reviewed by <a className="author-review">{hoveredAlbum?.author}</a> on {hoveredAlbum?.date?.split(" ")[2]}
          </div>
          <div className="score">{hoveredAlbum?.score}/10</div>
          <a className="pitchfork-link" href={hoveredAlbum ? hoveredAlbum.link : "#"}>Read on pitchfork</a>
        </div>
      </div>
    </StyledPopup>
  )
}

export default GalaxyPopup
