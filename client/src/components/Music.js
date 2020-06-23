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
`

const Music = () => {
  const [audio, setAudio] = useState(new Audio(waterMusic))
  const [firstInteraction, setFirstInteraction] = useState(true)

  const fadeAudio = () => gsap.to(audio, { volume: audio.volume ? 0 : 0.3, duration: 1.3 })

  useEffect(() => {
    audio.volume = 0.3

    const playAudio = () => audio.play()

    audio.addEventListener("ended", playAudio)
    window.addEventListener("click", () => {
      if (firstInteraction) {
        playAudio()
        setFirstInteraction(false)
      }
    })
    return () => {
      // window.removeEventListener("click", toggleMuted)
      audio.removeEventListener("ended", playAudio)
    }
  }, [audio, firstInteraction])

  return (
    <MusicContainer>
      <div onClick={fadeAudio} className="play">
        PLAY
      </div>
    </MusicContainer>
  )
}

export default Music
