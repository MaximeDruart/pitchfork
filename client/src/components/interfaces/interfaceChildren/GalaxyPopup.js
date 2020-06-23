import React from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"

const StyledPopup = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  opacity: ${(props) => (props.show ? 0.8 : 0)};
  color: white;
  z-index: 1000;
  position: fixed;
  top: 6vh;
  right: 6vw;
  /* transform: ${(props) => (props.pos ? `translate(${props.pos[0]}px, ${props.pos[1]}px)` : "none")}; */
  .popup-container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    min-height: 20vh;
    .album-cover {
      background: blue;
      width: 160px;
      border-radius: 10px 0px 0px 10px;
      object-fit : cover;
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
        .author-review {
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
  }
`

const GalaxyPopup = () => {
  const { hoveredAlbum, albumPosition } = useSelector((state) => state.interface)
  const posRounded = albumPosition && [Math.floor(albumPosition[0]), Math.floor(albumPosition[1])]
  return (
    <StyledPopup pos={posRounded} show={!!hoveredAlbum}>
      <div className="popup-container">
        <img className="album-cover" src={hoveredAlbum?.coverSrc} alt="" />
        <div className="text-container">
          <div className="album-name">{hoveredAlbum?.album}</div>
          <div className="album-artist">{hoveredAlbum?.artist}</div>
          <div className="reviewer">
            Reviewed by
            <span className="author-review">{hoveredAlbum?.author}</span>
            on {hoveredAlbum?.date?.split(" ")[2]}
          </div>
          <div className="score">{hoveredAlbum?.score}/10</div>
          <a
            className="pitchfork-link"
            rel="noopener noreferrer"
            target="_blank"
            href={hoveredAlbum ? hoveredAlbum.link : "#"}
          >
            Read on pitchfork
          </a>
        </div>
      </div>
    </StyledPopup>
  )
}

export default GalaxyPopup
