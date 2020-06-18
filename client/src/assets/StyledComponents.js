import styled from "styled-components"

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
