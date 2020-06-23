import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"
import gsap from "gsap"
import ThreePlugin from "./GSAPTHREE"
import styled from "styled-components"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { useLocation } from "react-router-dom"
import { dateToYearPercent, degToRad } from "./utils"
import { setHoveredAlbum, setAlbumPosition } from "../../redux/actions/interfaceActions"
import Stats from "stats.js"
import { st } from "../../assets/StyledComponents"
import { textTextures, scoreTextures } from "../../assets/textTextures"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

gsap.registerPlugin(ThreePlugin)

const StyledCanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${(p) => (p.pathname.includes("/reviewer/") ? "inherit" : -1)};
  /* opacity: 0.4; */
`

const fov = 60

const th = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 150),
  renderer: new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  }),
  rayCaster: new THREE.Raycaster(),
  axesHelper: new THREE.AxesHelper(10),
  gridHelper: new THREE.GridHelper(200, 200),
  polarGridHelper: new THREE.PolarGridHelper(5, 1, 1, 64),

  controls: "",
  tbcontrols: "",
  sphere: {
    geometry: new THREE.SphereGeometry(0.25, 12, 12),
    material: new THREE.MeshLambertMaterial(),
  },
  sphereGroup: "",
  filteredSphereGroup: "",
  sceneSize: {
    width: 140,
    height: 16,
    depth: 52, // keeping a 50th of sampleSize seems good
  },
  fog: {
    near: 10,
    far: 19.5,
    color: 0x99000000,
  },
  textures: [],
  scoreTextures: [],
  infiniteRotationTl: "",
}
th.cameraHelper = new THREE.CameraHelper(th.camera)
th.sphere.mesh = new THREE.Mesh(th.sphere.geometry, th.sphere.material)
th.polarGridHelper.material.transparent = true
th.polarGridHelper.material.opacity = 0.3

let centerPoints = []
for (let i = 0; i < 65; i++)
  centerPoints.push(new THREE.Vector3().setFromSphericalCoords(5 / 2, Math.PI / 2, ((Math.PI * 2) / 64) * i))

const centerLineGeometry = new THREE.BufferGeometry().setFromPoints(centerPoints)
const centerLine = new THREE.Line(
  centerLineGeometry,
  new THREE.LineBasicMaterial({
    color: "white",
    transparent: true,
    opacity: 0.25,
  })
)
centerLine.rotation.z = degToRad(13)
centerLine.name = "centerLine"

const THREECanvas = () => {
  const $canvas = useRef(null)
  // const api = useSelector(state => state.api, shallowEqual)
  const reviews = useSelector((state) => state.api.reviews, shallowEqual)
  const activeReviewer = useSelector((state) => state.api.activeReviewer, shallowEqual)
  const loading = useSelector((state) => state.api.loading, shallowEqual)
  const filteredReviews = useSelector((state) => state.api.filteredReviews, shallowEqual)

  const [spawnDone, setSpawnDone] = useState(false)

  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const toggleOrbitControls = (isTrue) => {
    if (!th.controls) {
      th.controls = new OrbitControls(th.camera, th.renderer.domElement)
    } else {
      th.controls.reset()
    }
    th.controls.enableDamping = true
    th.controls.enableRotate = false
    th.controls.enableZoom = true

    th.controls.mouseButtons.LEFT = THREE.MOUSE.PAN
    th.controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
    // th.controls.screenSpacePanning = true
    th.controls.panSpeed = 2

    th.controls.maxDistance = 50
    th.controls.minDistance = 5
    th.controls.dampingFactor = 0.05
    th.controls.addEventListener("change", () => {
      if (pathname === "/galaxy" && th.scene.fog) {
        // adjusting fog with distance. The goal is having a clear view for afar but be foggy upfront so that the data appears "readable"
        th.scene.fog.far = Math.max(th.camera.position.z * 1.8, th.fog.far)
      }
    })
  }

  const switchControlsForReviewer = (bool = true) => {
    if (th.controls) {
      th.controls.reset()
      th.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE
      th.controls.mouseButtons.RIGHT = null
      th.controls.enableRotate = true
      th.controls.enableZoom = false
    }
  }

  const toggleTrackBallControls = (isTrue = true) => {
    th.tbcontrols = new TrackballControls(th.camera, th.renderer.domElement)
    th.tbcontrols.mouseButtons.LEFT = THREE.MOUSE.PAN
    th.tbcontrols.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
    th.tbcontrols.rotateSpeed = 0.8
    th.tbcontrols.zoomSpeed = 1
    th.tbcontrols.panSpeed = 0.4
    th.tbcontrols.noRotate = true
    // th.tbcontrols.dynamicDampingFactor = 2

    th.tbcontrols.keys = [65, 83, 68]
  }

  const toggleHelp = (isTrue) => {
    if (isTrue) {
      th.scene.add(th.axesHelper)
      th.scene.add(th.gridHelper)
      th.scene.add(th.cameraHelper)
      // th.scene.add(th.polarGridHelper)
    } else {
      th.scene.remove(th.axesHelper)
      th.scene.remove(th.gridHelper)
      th.scene.add(th.cameraHelper)
      // th.scene.remove(th.polarGridHelper)
    }
  }

  const toggleRadialHelp = (isTrue = true) => {
    if (isTrue) {
      th.scene.add(th.polarGridHelper)
    } else {
      th.scene.remove(th.polarGridHelper)
    }
  }

  // cleaning the scene when the scene is loaded. (only useful on page transitions)
  const clearSceneOfSphereGroup = () => {
    if (th.scene?.children) {
      th.scene.children.forEach((child) => {
        if (child.name === "sphereGroup" || child.name === "centerLine") th.scene.remove(child)
      })
    }
  }

  // threejs scene
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textTextures.forEach((textTexture) => {
      textureLoader.load(textTexture, (_texture) => {
        _texture.minFilter = THREE.LinearFilter
        th.textures.push(_texture)
      })
    })

    scoreTextures.forEach((_scoreTexture) => {
      textureLoader.load(_scoreTexture, (_scoreTexture) => {
        _scoreTexture.minFilter = THREE.LinearFilter
        th.scoreTextures.push(_scoreTexture)
      })
    })

    let mouse = new THREE.Vector2()
    let clicking = false
    let openedAlbum = false

    /**
     * Raycasting
     */

    const onMouseMoveHandler = ({ x, y }) => {
      // calculate mouse position in normalized device coordinates : (-1 to +1) for both components
      mouse.x = (x / window.innerWidth) * 2 - 1
      mouse.y = -(y / window.innerHeight) * 2 + 1
    }
    const onMouseDownHandler = (event) => {
      if (event.target.tagName === "CANVAS") clicking = true
    }
    const onMouseUpHandler = () => (clicking = false)

    /**
     * Lighting
     */

    const hemiLight = new THREE.HemisphereLight("red", "blue", 0.38)
    // const hemiLight = new THREE.HemisphereLight("red", "blue", 0.68)
    // hemiLight.
    th.scene.add(hemiLight)
    const ambientLight = new THREE.AmbientLight("white", 0.59)
    th.scene.add(ambientLight)

    /**
     * Renderer
     */
    th.renderer.setSize(window.innerWidth, window.innerHeight)
    th.renderer.setPixelRatio(window.devicePixelRatio)
    th.renderer.setClearAlpha(0)
    $canvas.current.appendChild(th.renderer.domElement)

    const animate = (t) => {
      stats.begin()

      // camera movements
      th.controls && th.controls.update()
      th.tbcontrols && th.tbcontrols.update()

      // update the picking ray with the camera and mouse position
      th.rayCaster.setFromCamera(mouse, th.camera)
      // calculate objects intersecting the picking ray
      const sphereGroup = th.scene.children.filter((child) => child.name === "sphereGroup")
      const intersects = th.rayCaster.intersectObjects(sphereGroup, true)

      $canvas.current.style.cursor = "default"

      if (clicking && intersects.length === 0 && openedAlbum) {
        openedAlbum = false
        dispatch(setHoveredAlbum(null))
        dispatch(setAlbumPosition(null))
      }
      for (var i = 0; i < intersects.length; i++) {
        if (intersects[0].object.material.opacity >= 1) {
          $canvas.current.style.cursor = "pointer"
          if (clicking) {
            dispatch(setHoveredAlbum(intersects[0].object.userData))

            th.scene.updateMatrixWorld()
            intersects[0].object.updateMatrixWorld()
            // converting 3d world pos to 2d screen pos
            const objectPos = new THREE.Vector3().copy(intersects[0].object.position)
            const vector = objectPos.project(th.camera)
            vector.x = ((vector.x + 1) * window.screen.width) / 2
            vector.y = (-(vector.y - 1) * window.screen.height) / 2
            dispatch(setAlbumPosition([vector.x, vector.y]))

            openedAlbum = true
            clicking = false
          }
        }
      }

      // small up and down movement
      if (th.sphereGroup.position) th.sphereGroup.position.y = Math.sin(t / 500) / 50

      th.renderer.render(th.scene, th.camera)
      stats.end()
      requestAnimationFrame(animate)
    }

    animate()

    const resizeHandler = () => {
      th.camera.aspect = window.innerWidth / window.innerHeight
      th.camera.updateProjectionMatrix()
      th.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("mousedown", onMouseDownHandler, false)
    window.addEventListener("mouseup", onMouseUpHandler, false)
    window.addEventListener("mousemove", onMouseMoveHandler, false)
    window.addEventListener("resize", resizeHandler)
    return () => {
      window.removeEventListener("mousedown", onMouseDownHandler, false)
      window.removeEventListener("mouseup", onMouseUpHandler, false)
      window.removeEventListener("mousemove", onMouseMoveHandler)
      window.removeEventListener("resize", resizeHandler)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // galaxy scene set up
  useEffect(() => {
    // aka page galaxy has just finished loading and querying reviews
    if (pathname === "/galaxy") {
      gsap.to(th.camera.position, {
        x: 0,
        y: 0,
        z: 10,
        duration: 0.5,
        ease: "Power2.easeInOut",
        onComplete: () => toggleOrbitControls(true),
      })
      if (!loading && reviews.length > 0) {
        th.scene.fog = new THREE.Fog(th.fog.color, th.fog.near, Math.max(th.camera.position.z * 1.8, th.fog.far))

        console.log("galaxy scene booting")
        if (th.infiniteRotationTl) {
          clearInterval(th.infiniteRotationTl)
        }
        clearSceneOfSphereGroup()

        const createSpheres = () => {
          const sphereGroup = new THREE.Group()
          sphereGroup.name = "sphereGroup"

          filteredReviews.forEach((review) => {
            const dateComputed = gsap.utils.mapRange(
              0,
              19,
              -th.sceneSize.width / 2,
              th.sceneSize.width / 2,
              dateToYearPercent(review.date)
            )
            const scoreComputed = gsap.utils.mapRange(
              1,
              10,
              -th.sceneSize.height / 2,
              th.sceneSize.height / 2,
              review.score
            )
            const depthComputed = -Math.random() * th.sceneSize.depth
            const sphere = new THREE.Mesh(
              th.sphere.geometry,
              // new THREE.MeshLambertMaterial({ color: st.genresColors[review.genre], transparent: true, opacity: 1 })
              new THREE.MeshPhongMaterial({
                color: st.genresColors[review.genre],
                transparent: true,
                opacity: 0,
                // emissive: st.genresColors[review.genre],
                // emissiveIntensity: 1.5,
              })
            )
            sphere.position.set(dateComputed, scoreComputed, depthComputed)
            sphere.userData = { ...review }
            sphereGroup.add(sphere)
          })
          return sphereGroup
        }

        console.log("running create sphere")

        th.sphereGroup = createSpheres()

        // addding dates
        const lines = new THREE.Group()
        lines.name = "lines"
        const lineMaterial = new THREE.LineBasicMaterial({ color: "white", transparent: true, opacity: 0.25 })
        const planeGeometry = new THREE.PlaneGeometry(1.8, 1)
        for (let i = 0; i <= 20; i++) {
          // creating lin
          const xPos = gsap.utils.mapRange(0, 20, -th.sceneSize.width / 2, th.sceneSize.width / 2, i)
          const points = []
          points.push(new THREE.Vector3(xPos, -5, -3))
          points.push(new THREE.Vector3(xPos, 5, -3))
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, lineMaterial)
          lines.add(line)
          // creating year name
          const year = new THREE.Mesh(
            planeGeometry,
            new THREE.MeshBasicMaterial({
              map: th.textures[i],
              transparent: true,
              opacity: 0.4,
            })
          )
          year.position.set(xPos, 5.5, -3)
          lines.add(year)
        }
        th.sphereGroup.add(lines)

        th.scene.add(th.sphereGroup)

        const materials = th.sphereGroup.children.map((child) => child.material)
        materials &&
          gsap.to(materials, {
            opacity: 1,
            stagger: { amount: 1.2 },
            duration: 0.5,
            onComplete: () => setSpawnDone(true),
          })
      }
    }
  }, [reviews, pathname])

  // galaxy filter updates
  useEffect(() => {
    if (pathname === "/galaxy") {
      if (reviews.length > 0 && !loading && spawnDone) {
        const albumNames = filteredReviews.map((review) => review.album)
        th.sphereGroup.children.forEach((sphere) => {
          sphere.material &&
            gsap.to(sphere.material, {
              duration: 0.8,
              ease: "Power2.easeOut",
              opacity: albumNames.includes(sphere.userData.album) ? 1 : 0.16,
            })
        })
      }
    }
  }, [filteredReviews])

  // REVIEWERDETAIL scene setup
  useEffect(() => {
    if (pathname.includes("/reviewer/")) {
      !th.scene.children.some((child) => child.name === "centerLine") && !reviews.length && th.scene.add(centerLine)
      th.scene.position.set(0, 0, 0)
      gsap.to(th.camera.position, {
        x: 0,
        y: 0,
        z: 10,
        duration: 0.5,
        ease: "Power2.easeInOut",
        onComplete: () => {
          toggleOrbitControls(true)
          switchControlsForReviewer()
        },
      })
      if (reviews.length && activeReviewer) {
        console.log("creating reviewer scene")

        clearSceneOfSphereGroup()

        const range = 5

        const lineGroup = new THREE.Group()
        const lineMaterial = new THREE.LineBasicMaterial({
          color: "white",
          transparent: true,
          opacity: 0.4,
        })
        const points = []
        points.push(new THREE.Vector3().setFromSphericalCoords(range, Math.PI / 2 + 0.05, 0))
        points.push(new THREE.Vector3().setFromSphericalCoords(range, Math.PI / 2 - 0.05, 0))
        for (let i = 0; i < 62; i++)
          points.push(new THREE.Vector3().setFromSphericalCoords(range, Math.PI / 2, ((Math.PI * 2) / 64) * i))
        points.push(new THREE.Vector3().setFromSphericalCoords(range, Math.PI / 2 + 0.05, (Math.PI * 2 * 61) / 64))
        points.push(new THREE.Vector3().setFromSphericalCoords(range, Math.PI / 2 - 0.05, (Math.PI * 2 * 61) / 64))

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const lineAround = new THREE.Line(lineGeometry, lineMaterial)

        let centerPoints = []
        for (let i = 0; i < 65; i++)
          centerPoints.push(
            new THREE.Vector3().setFromSphericalCoords(range / 2, Math.PI / 2, ((Math.PI * 2) / 64) * i)
          )

        const centerLineGeometry = new THREE.BufferGeometry().setFromPoints(centerPoints)
        const centerLine = new THREE.Line(
          centerLineGeometry,
          new THREE.LineBasicMaterial({
            color: "white",
            transparent: true,
            opacity: 0.1,
          })
        )

        const middleAxis = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 5, 0), new THREE.Vector3(0, -5, 0)]),
          new THREE.LineBasicMaterial({
            color: "white",
            transparent: true,
            opacity: 0.1,
          })
        )

        // decoration
        lineGroup.add(lineAround)
        lineGroup.add(centerLine)
        lineGroup.add(middleAxis)

        const reviewsForReviewer = reviews.filter((_review) => _review.author === activeReviewer.name)
        th.sphereGroup = new THREE.Group()
        th.sphereGroup.name = "sphereGroup"
        th.sphereGroup.rotation.z = degToRad(13)

        const innerSphereGroup = new THREE.Group()
        innerSphereGroup.name = "innerSphereGroup"
        innerSphereGroup.visible = false
        const sphereRviewerGeometry = new THREE.SphereGeometry(0.15, 12, 12)
        reviewsForReviewer.forEach((review) => {
          // const roComputed = gsap.utils.mapRange(0, 10, 0, range, review.score) // radius
          const roComputed = gsap.utils.random(0.5 * range, 0.95 * range) // radius
          const thetaComputed = dateToYearPercent(review.date, "rad") // x-y angle
          const phiComputed = Math.PI / 2 // z angle
          // const phiComputed = gsap.utils.random(Math.PI / 2 - variationPhi, Math.PI / 2 + variationPhi) // z angle

          const sphere = new THREE.Mesh(
            sphereRviewerGeometry,
            new THREE.MeshPhongMaterial({
              color: st.genresColors[review.genre],
              transparent: true,
              opacity: 0,
            })
          )
          sphere.position.setFromSphericalCoords(roComputed, phiComputed, thetaComputed)
          sphere.position.y += gsap.utils.mapRange(0, 10, -3, 3, review.score)
          sphere.userData = {
            ...review,
            spherical: [roComputed, phiComputed, thetaComputed],
          }
          sphere.name = "sphere"
          innerSphereGroup.add(sphere)
        })

        const planeGeometry = new THREE.PlaneGeometry(0.54, 0.3)
        const planeScoreGeometry = new THREE.PlaneGeometry(0.76, 0.3)
        const yearStartLabel = new THREE.Mesh(
          planeGeometry,
          new THREE.MeshBasicMaterial({
            map: th.textures[0],
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        )
        const yearEndLabel = new THREE.Mesh(
          planeGeometry,
          new THREE.MeshBasicMaterial({
            map: th.textures[th.textures.length - 1],
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        )
        const scoreLabel1 = new THREE.Mesh(
          planeScoreGeometry,
          new THREE.MeshBasicMaterial({
            map: th.scoreTextures[0],
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        )

        const scoreLabel2 = new THREE.Mesh(
          planeScoreGeometry,
          new THREE.MeshBasicMaterial({
            map: th.scoreTextures[1],
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        )

        const scoreLabel3 = new THREE.Mesh(
          planeScoreGeometry,
          new THREE.MeshBasicMaterial({
            map: th.scoreTextures[1],
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        )
        scoreLabel2.position.y = 3
        scoreLabel3.position.y = -3

        yearStartLabel.position.setFromSphericalCoords(5, Math.PI / 2, degToRad(4))
        yearStartLabel.lookAt(0, 0, 0)
        yearStartLabel.rotation.y += Math.PI
        yearStartLabel.position.y += 0.2

        yearEndLabel.position.setFromSphericalCoords(5, Math.PI / 2, degToRad(339))
        yearEndLabel.lookAt(0, 0, 0)
        yearEndLabel.rotation.y += Math.PI
        yearEndLabel.position.y += 0.2

        th.sphereGroup.add(scoreLabel1)
        th.sphereGroup.add(scoreLabel2)
        th.sphereGroup.add(scoreLabel3)
        th.sphereGroup.add(yearStartLabel)
        th.sphereGroup.add(yearEndLabel)

        th.sphereGroup.add(innerSphereGroup)
        th.sphereGroup.add(lineGroup)
        th.scene.add(th.sphereGroup)

        console.log(th.scene.children)

        const labelsMaterials = [
          scoreLabel1.material,
          scoreLabel2.material,
          scoreLabel3.material,
          yearStartLabel.material,
          yearEndLabel.material,
        ]
        const innerSphereMaterials = innerSphereGroup.children.map((child) => child.material)

        // eslint-disable-next-line no-unused-vars
        const spawnTl = gsap
          .timeline({
            defaults: {
              duration: 0.6,
              ease: "Power3.easeInOut",
            },
          })
          .addLabel("sync")
          .from(lineAround.scale, { x: 0.01, y: 0.01, z: 0.01 })
          .from(centerLine.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.4 }, "-=0.32")
          .from(middleAxis.scale, { y: 0.01, onComplete: () => (innerSphereGroup.visible = true) }, "-=0.1")
          .to(innerSphereMaterials, {
            opacity: 1,
            stagger: { amount: 1.2 },
            duration: 0.5,
          })
          .from(labelsMaterials, { opacity: 0 })

        // infinite rotation
        if (!th.infiniteRotationTl) {
          th.infiniteRotationTl = setInterval(() => {
            th.sphereGroup.rotation.y += 0.003
          }, 15)
        }
      } else {
        !reviews.length &&
          gsap.to(centerLine.scale, { duration: 0.6, x: 0.01, y: 0.01, z: 0.01, yoyo: true, repeat: -1 })
      }
    }
  }, [activeReviewer, reviews.length])

  return <StyledCanvasContainer pathname={pathname} ref={$canvas} />
}

export default React.memo(THREECanvas)
