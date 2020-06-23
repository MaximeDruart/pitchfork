import React, { useEffect, useState } from "react"
import styled from "styled-components"
import waterMusic from "../assets/audio/water.mp3"
import gsap from "gsap"

const MusicContainer = styled.div`
  position: absolute;
  bottom: 10vh;
  right: 10vw;
  z-index: 1000;
  color: white;
  cursor: pointer;
  .equalizer {
    position: absolute;
    top: 7px;
    left: 5px;
    width: 30px;
    height: 30px;
    .equalizerBar {
      position: absolute;
      bottom: 0;
      width: 0;
      height: 30px;
      border-left: 4px solid white;
      transition: 0.2s ease-out 0.2s;
      animation-name: equalizer-play;
      animation-iteration-count: infinite;
      animation-timing-function: ease;
      animation-fill-mode: both;
      animation-name: ${(p) => (!p.volume ? "equalizer-play" : "equalizer-ended")};
    }
    .equalizer1 {
      left: 0;
      animation-duration: 0.7s;
    }
    .equalizer2 {
      left: 6px;
      animation-duration: 0.6s;
    }
    .equalizer3 {
      left: 12px;
      animation-duration: 0.68s;
    }
    .equalizer4 {
      left: 18px;
      animation-duration: 0.62s;
    }
    .equalizer5 {
      left: 24px;
      animation-duration: 0.66s;
    }
    @keyframes equalizer-play {
      0% {
        height: 8px;
      }
      100% {
        height: 8px;
      }
      50% {
        height: 20px;
      }
    }
    @keyframes equalizer-ended {
      0% {
        height: 3px;
      }
      100% {
        height: 3px;
      }
    }
  }
`

const Music = () => {
  const [audio] = useState(new Audio(waterMusic))
  const [dum, setDum] = useState("test")

  const fadeAudio = () =>
    gsap.to(audio, { volume: audio.volume ? 0 : 0.3, duration: 1.3, onStart: () => setDum(audio.volume) })

  useEffect(() => {
    audio.volume = 0.3
    const playAudio = () => audio.play()

    window.addEventListener(
      "click",
      () => {
        playAudio()
        setDum("zooooomz")
      },
      { once: true }
    )
    audio.addEventListener("ended", playAudio)
    return () => audio.removeEventListener("ended", playAudio)
  }, [])

  return (
    <MusicContainer dum={dum} volume={audio.volume}>
      <div onClick={fadeAudio} className="play">
        <span className="equalizer">
          <span className="equalizerBar equalizer1"></span>
          <span className="equalizerBar equalizer2"></span>
          <span className="equalizerBar equalizer3"></span>
          <span className="equalizerBar equalizer4"></span>
          <span className="equalizerBar equalizer5"></span>
        </span>
      </div>
    </MusicContainer>
  )
}

export default Music
