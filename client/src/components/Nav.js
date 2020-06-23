import React from "react"
import styled from "styled-components"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"

const Nav = () => {
  let activeReviewer = useSelector((state) => state.api.activeReviewer)
  if (!activeReviewer) activeReviewer = { slug: "andy-beta" }
  return (
    <StyledNav>
      <div className="nav-elements">
        <NavLink to="/galaxy" className="nav-element">
          <div className="nav-bar"></div>
          <div className="nav-link-text">albums</div>
        </NavLink>
        <NavLink to={`/reviewer/${activeReviewer.slug}`} className="nav-element">
          <div className="nav-bar"></div>
          <div className="nav-link-text">reviewers</div>
        </NavLink>
        <NavLink to="/credits" className="nav-element nav-small">
          <div className="nav-bar"></div>
          <div className="nav-link-text">credits</div>
        </NavLink>
      </div>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 3vw;
  z-index: 1000;
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
    .nav-small {
      .nav-bar {
        /* width: 3px;
        height: 60%; */
        opacity: 0.3;
      }
    }
  }
`

export default Nav
