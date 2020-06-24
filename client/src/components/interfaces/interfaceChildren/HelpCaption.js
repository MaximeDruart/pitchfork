import React from "react"
import styled, { keyframes, css } from "styled-components"
import { useSelector } from "react-redux"
import mouseSvg from "../../../assets/icons/mouse.svg"
import { st } from "../../../assets/StyledComponents"

const shinekf = keyframes`
  from {opacity : 0.42};
  to {opacity : 0.64};
`

const shine = () =>
  css`
    ${shinekf} 1.4s ease alternate infinite;
  `

const HelpContainer = styled.div`
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
  font-size: ${st.fzLarge};

  &:after {
    content: "";
    position: absolute;
    right: -34px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    background: no-repeat center url(${mouseSvg});
    animation: ${shine};
  }
`

const HelpCaption = ({ children = "click and drag to discover" }) => {
  const hasInteractedWithCanvas = useSelector((state) => state.interface.hasInteractedWithCanvas)
  const reviews = useSelector((state) => state.api.reviews)

  return (
    <HelpContainer loaded={reviews.length} int={hasInteractedWithCanvas}>
      {children}
    </HelpContainer>
  )
}

export default HelpCaption
