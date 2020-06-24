import styled from "styled-components"
import { Link } from "react-router-dom"

export const st = {
  gradient: "linear-gradient(90deg, rgba(124,27,248,1) 0%, rgba(248,40,78,1) 100%)",
  background: "#212029",
  fzSmall: "1rem",
  fzMedium: "1.2rem",
  fzLarge: "1.6rem",
  txtGrey: "#868686",
  genresColors: {
    "Folk/Country": "#BD94F0",
    Rock: "#FFF4BD",
    Electronic: "#95D0CD",
    Experimental: "#DCAC74",
    Rap: "#A7DE85",
    "Pop/R&B": "#EBA8F5",
    Jazz: "#8284B2",
    Metal: "#B11569",
    Global: "#FFFFFF",
  },
}

export const Button = styled.button`
  display: inline-block;
  border: 1px solid white;
  text-transform: uppercase;
  padding: 1.2rem 2.4rem;
  margin: 0;
  text-decoration: none;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  transition: border 250ms ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;

  &:hover,
  &:focus {
    border: 2px solid white;
  }
`

export const NavButton = styled(Link)`
  display: inline-block;
  position: relative;
  padding: 1.2rem 2.4rem;
  margin: 0;
  background: transparent;
  border: 1px solid white;
  color: #ffffff;
  font-size: 1rem;
  text-transform: uppercase;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: 0.8s;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover,
  &:focus {
    color: black;
  }

  &:hover:before {
    position: absolute;
    left: 0%;
    width: 100%;
  }

  &:before {
    display: inline-block;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 0px;
    height: 100%;
    z-index: -1;
    content: "";
    background: white;
    color: black;
    transition: all 0.5s ease-in-out;
  }
`
