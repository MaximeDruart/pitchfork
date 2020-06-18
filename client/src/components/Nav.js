import React from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { changePage } from "../redux/actions/uiActions"

const Nav = () => {
  const dispatch = useDispatch()
  return (
    <StyledNav>
      <div className="nav-elements">
        <div onClick={() => dispatch(changePage("/galaxy"))} className="nav-element">
          <div className="nav-bar"></div>
          <div className="nav-link-text">albums</div>
        </div>
        <div onClick={() => dispatch(changePage("/reviewer/andy-beta"))} className="nav-element">
          <div className="nav-bar"></div>
          <div className="nav-link-text">reviewers</div>
        </div>
        <div onClick={() => dispatch(changePage("/else"))} className="nav-element">
          <div className="nav-bar"></div>
          <div className="nav-link-text">else</div>
        </div>
      </div>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 3vw;
  .nav-elements {
    .nav-element {
      display: block;
      position: relative;
      height: 40px;
      margin-bottom: 12px;
      padding: 0 15px;
      cursor: pointer;

      .nav-bar {
        height: 100%;
        width: 5px;
        background-color: #ffffff;
        opacity: 0.5;
        transition: transform 0.3s ease;
      }

      .nav-link-text {
        position: absolute;
        top: 50%;
        right: 30px;
        opacity: 0;
        transform: translateY(-50%);
        transition: all 0.6s ease-in-out;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.7);
      }

      &.active {
        .nav-bar {
          opacity: 1;
        }
        .nav-link-text {
          opacity: 1;
        }
      }

      &:hover {
        .nav-bar {
          transform: scaleX(1.6);
        }
        .nav-link-text {
          opacity: 1;
        }
      }
    }
  }
`

export default Nav
