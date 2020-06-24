/* eslint react-hooks/exhaustive-deps: 0 */

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import ThreePlugin from "./GSAPTHREE"
import styled from "styled-components"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { useLocation } from "react-router-dom"
import { dateToYearPercent, degToRad } from "./utils"
import { setHoveredAlbum, setAlbumPosition, setCanvasInteraction } from "../../redux/actions/interfaceActions"
import { st } from "../../assets/StyledComponents"
import { textTextures, scoreTextures } from "../../assets/textTextures"
import SimplexNoise from "simplex-noise"

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
  simplex: new SimplexNoise(),
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
    linewidth: 5,
  })
)
centerLine.rotation.z = degToRad(13)
centerLine.rotation.x = degToRad(10)
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
    th.controls.enableZoom = false

    th.controls.mouseButtons.LEFT = THREE.MOUSE.PAN
    th.controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
    th.controls.panSpeed = 2

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

  // cleaning the scene when the scene is loaded. (only useful on page transitions)
  const clearSceneOfSphereGroup = () => {
    if (th.scene?.children) {
      th.scene.children.forEach((child) => {
        if (
          child.name === "sphereGroup" ||
          child.name === "centerLine" ||
          child.name === "yearLines" ||
          child.name === "sphereIntros"
        )
          th.scene.remove(child)
      })
    }
  }

  const getLinesGroupGalaxy = () => {
    const lines = new THREE.Group()
    lines.name = "yearLines"
    const lineMaterial = new THREE.LineBasicMaterial({ color: "white", transparent: true, opacity: 0.18 })
    for (let i = 0; i <= 20; i++) {
      // creating lin
      const xPos = gsap.utils.mapRange(0, 20, -th.sceneSize.width / 2, th.sceneSize.width / 2, i)
      const points = []
      points.push(new THREE.Vector3(xPos, -5, -3))
      points.push(new THREE.Vector3(xPos, 5, -3))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, lineMaterial)
      lines.add(line)
    }
    return lines
  }

  const getLabelsGroupGalaxy = () => {
    const labels = new THREE.Group()
    labels.name = "yearLabels"
    const planeGeometry = new THREE.PlaneGeometry(1.8, 1)
    for (let i = 0; i <= 20; i++) {
      const xPos = gsap.utils.mapRange(0, 20, -th.sceneSize.width / 2, th.sceneSize.width / 2, i)

      const year = new THREE.Mesh(
        planeGeometry,
        new THREE.MeshBasicMaterial({
          map: th.textures[i],
          transparent: true,
          opacity: 0.4,
        })
      )
      year.position.set(xPos, 5.5, -3)
      labels.add(year)
    }
    return labels
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
      dispatch(setCanvasInteraction())
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

  const randomProp = (obj) => {
    const keys = Object.keys(obj)
    return obj[keys[(keys.length * Math.random()) << 0]]
  }

  useEffect(() => {
    if (pathname === "/") {
      const sphereIntros = new THREE.Group()
      sphereIntros.name = "sphereIntros"
      sphereIntros.rotation.y = -Math.PI / 6
      sphereIntros.rotation.x = -Math.PI / 7
      sphereIntros.position.y = -0.5
      for (let i = 0; i < 200; i++) {
        const sphere = new THREE.Mesh(
          th.sphere.geometry,
          new THREE.MeshPhongMaterial({
            color: randomProp(st.genresColors),
            transparent: true,
            opacity: 0.8,
          })
        )

        sphere.position.x = -22
        const keyframes = []
        const noiseXOffset = gsap.utils.random(0, 1000, 1)
        for (let x = 0; x < 80; x++) {
          keyframes.push({
            x: sphere.position.x + x / 1.6,
            y: th.simplex.noise2D(noiseXOffset + x / 30, 0) * 2.5,
            z: th.simplex.noise2D(0, noiseXOffset + x / 30) * 2.5,
            ease: "linear",
          })
          sphere.userData.keyframes = keyframes
        }
        sphereIntros.add(sphere)
      }

      const introTl = gsap.timeline({ repeat: -1 }).addLabel("sync")
      sphereIntros.children.forEach((sphere) => {
        introTl.to(sphere.position, { duration: 4, keyframes: sphere.userData.keyframes }, "-=3.7")
      })
      th.camera.position.set(0, 0, 6)
      th.scene.add(sphereIntros)
    }
  }, [pathname])

  // galaxy scene set up
  useEffect(() => {
    // aka page galaxy has just finished loading and querying reviews
    if (pathname === "/galaxy") {
      gsap.set(th.camera.position, {
        x: 0,
        y: 0,
        z: 17,
        duration: 0.5,
        ease: "Power2.easeInOut",
        onComplete: () => {
          toggleOrbitControls(true)
          th.scene.fog = new THREE.Fog(th.fog.color, th.fog.near, Math.max(th.camera.position.z * 1.8, th.fog.far))
        },
      })

      const lines = getLinesGroupGalaxy()
      if (!th.scene.children.some((child) => child.name === "yearLines") && !reviews.length) {
        th.scene.add(lines)
        gsap.from(lines.children, { duration: 0.6, stagger: 0.1, three: { scaleY: 0.001 } })
      }

      // animate lines

      if (!loading && reviews.length > 0) {
        th.infiniteRotationTl && clearInterval(th.infiniteRotationTl)

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

        th.sphereGroup = createSpheres()

        th.scene.add(th.sphereGroup)

        const labels = getLabelsGroupGalaxy()
        const lines = getLinesGroupGalaxy()
        th.sphereGroup.add(labels)
        th.sphereGroup.add(lines)
        const labelsMaterials = labels.children.map((child) => child.material)
        gsap.from(labelsMaterials, {
          opacity: 0,
          duration: 0.9,
        })

        const materials = th.sphereGroup.children.map((child) => child.material)
        materials &&
          gsap.to(materials, {
            opacity: 1,
            stagger: { amount: 1.7 },
            duration: 0.5,
            onComplete: () => setSpawnDone(true),
          })
      }
    }
  }, [reviews, pathname, loading])

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
  }, [filteredReviews, loading, pathname, reviews.length, spawnDone])

  // REVIEWERDETAIL scene setup
  useEffect(() => {
    if (pathname.includes("/reviewer/")) {
      !th.scene.children.some((child) => child.name === "centerLine") && !reviews.length && th.scene.add(centerLine)
      th.scene.position.set(0, 0, 0)
      gsap.set(th.camera.position, {
        x: 0,
        y: 0,
        z: 10,
        onComplete: () => {
          toggleOrbitControls(true)
          switchControlsForReviewer()
          if (th.camera.position.z !== 10) th.camera.position.z = 10
        },
      })
      if (reviews.length && activeReviewer) {
        th.scene.fog = null
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
            map: th.scoreTextures[2],
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          })
        )
        scoreLabel1.position.y = -3
        scoreLabel2.position.y = 0
        scoreLabel3.position.y = 3

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
            th.sphereGroup.rotation.y -= 0.003
          }, 15)
        }
      } else {
        !reviews.length &&
          gsap.to(centerLine.scale, { duration: 0.6, x: 0.01, y: 0.01, z: 0.01, yoyo: true, repeat: -1 })
      }
    }
  }, [activeReviewer, reviews.length, pathname, reviews])

  return <StyledCanvasContainer pathname={pathname} ref={$canvas} />
}

export default React.memo(THREECanvas)
