import React from "react"
import styled from "styled-components"

// Import icons
import behance from "../../assets/icons/behance.svg"
import linkedin from "../../assets/icons/linkedin.svg"
import github from "../../assets/icons/github.svg"

const CreditsContainer = styled.div`
  font-family: "Oswald-Light";
  color: white;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    padding: 60px 0px;
    img.go-back {
      width: 25px;
      height: 25px;
    }
  }
  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    .team {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      width: 550px;
      .align-column {
        display: flex;
        flex-direction: column;
      }
      .member {
        padding-right: 20px;
        margin-bottom: 15px;
        .name {
          font-size: 24px;
        }
        .role {
          font-family: "Oswald-ExtraLight";
          margin-bottom: 15px;
          font-size: 18px;
        }
        img {
          width: 28px;
          height: 28px;
          color: white;
          margin-left: 3px;
          opacity: 0.5;
          transition: 1s;
        }
        img:hover {
          opacity: 1;
        }
      }
    }
    .right {
      width: 600px;
      .disclaimer,
      .about-us {
        font-family: "Oswald-ExtraLight";
        font-size: 22px;
        padding-bottom: 55px;
      }
    }
  }
  .title {
    font-family: "Oswald-Medium";
    text-transform: uppercase;
    font-size: 30px;
    margin-bottom: 25px;
  }
`

const Credits = () => {
  return (
    <CreditsContainer>
      <div className="header">
        {/* <a href="#">
          <img className="go-back" src={nextLeftButton} alt="return"></img>
        </a> */}
      </div>
      <div className="container">
        <div className="align-column">
          <div className="title">the team</div>
          <div className="team">
            <div className="align-column">
              <div className="member">
                <div className="name">Joëlla AKOUATÉ</div>
                <div className="role">UX/UI Designer</div>
                <div className="social-networks">
                  <a href="https://www.linkedin.com/in/joellaakouate/" target="_blank" rel="noreferrer noopener">
                    <img src={linkedin} alt="social-network"></img>
                  </a>
                  <a href="https://www.behance.net/joellaakouate" target="_blank" rel="noreferrer noopener">
                    <img src={behance} alt="social-network"></img>
                  </a>
                </div>
              </div>
              <div className="member">
                <div className="name">Aurélie DO</div>
                <div className="role">UX/UI Designer, front-end developer</div>
                <div className="social-networks">
                  <a href="https://www.linkedin.com/in/aureliedo/" target="_blank" rel="noreferrer noopener">
                    <img src={linkedin} alt="social-network"></img>
                  </a>
                  <a href="https://www.behance.net/aureliedo" target="_blank" rel="noreferrer noopener">
                    <img src={behance} alt="social-network"></img>
                  </a>
                </div>
              </div>
              <div className="member">
                <div className="name">Céline SUNG</div>
                <div className="role">UX/UI Designer, front-end developer</div>
                <div className="social-networks">
                  <a href="https://www.linkedin.com/in/celinesung/" target="_blank" rel="noreferrer noopener">
                    <img src={linkedin} alt="social-network"></img>
                  </a>
                  <a href="https://www.behance.net/celinesung" target="_blank" rel="noreferrer noopener">
                    <img src={behance} alt="social-network"></img>
                  </a>
                </div>
              </div>
            </div>
            <div className="align-column">
              <div className="member">
                <div className="name">Pierre BORNSTEIN</div>
                <div className="role">Data analyst, Marketing manager</div>
                <div className="social-networks">
                  <a href="https://www.linkedin.com/in/pierrebornstein/" target="_blank" rel="noreferrer noopener">
                    <img src={linkedin} alt="social-network"></img>
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCsIzfsOcObtsEXOwtsFlcFA/videos"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img src={github} alt="social-network"></img>
                  </a>
                  {/* <a href="#" target="_blank" rel="noreferrer noopener">
                    <img src={behance} alt="social-network"></img>
                  </a> */}
                </div>
              </div>
              <div className="member">
                <div className="name">Maxime DRUART</div>
                <div className="role">Front-end developer, back-end developer</div>
                <div className="social-networks">
                  <a href="https://www.linkedin.com/in/pierrebornstein/" target="_blank" rel="noreferrer noopener">
                    <img src={linkedin} alt="social-network"></img>
                  </a>
                  <a href="http://github.com/maximeDruart/" target="_blank" rel="noreferrer noopener">
                    <img src={github} alt="social-network"></img>
                  </a>
                  <a href="https://www.behance.net/maximedruart" target="_blank" rel="noreferrer noopener">
                    <img src={behance} alt="social-network"></img>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="about-us">
            <div className="title">about us</div>
            Music is a timeless art whose trends change rapidly. The ambition of this Pitchfork project is to analyze
            the evolution of critics in order to visualize the different musical trends and genres in a defined time
            space.
          </div>
          <div className="disclaimer">
            <div className="title">disclaimer</div>
            This site was created for educational purposes as part of the Grande Ecole course at HETIC. The content and
            data presented have not been the subject of a request for a right of use. In no case will this site be used
            for commercial purposes.
            <br />
            Background Music : Watermusic 2 by William Basinski. All right reserved William Basinski / [Merlin] SC
            Distribution.
          </div>
        </div>
      </div>
    </CreditsContainer>
  )
}

export default Credits
