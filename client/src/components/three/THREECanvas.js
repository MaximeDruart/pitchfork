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
import textTextures from "../../assets/textTextures"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

gsap.registerPlugin(ThreePlugin)

const StyledCanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
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
    depth: 60, // keeping a 50th of sampleSize seems good
  },
  fog: {
    near: 10,
    far: 19.5,
    color: 0x99000000,
  },
  textures: [],
}
th.cameraHelper = new THREE.CameraHelper(th.camera)
th.sphere.mesh = new THREE.Mesh(th.sphere.geometry, th.sphere.material)
th.polarGridHelper.material.transparent = true
th.polarGridHelper.material.opacity = 0.3

// th.sphereInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

const THREECanvas = () => {
  const $canvas = useRef(null)
  // const api = useSelector(state => state.api, shallowEqual)
  const reviews = useSelector((state) => state.api.reviews, shallowEqual)
  const activeReviewer = useSelector((state) => state.api.activeReviewer, shallowEqual)
  const loading = useSelector((state) => state.api.loading, shallowEqual)
  const filteredReviews = useSelector((state) => state.api.filteredReviews, shallowEqual)

  const [spawnDone, setSpawnDone] = useState(false)

  // const { loading, filteredReviews } = useSelector(
  //   (state) => ({
  //     loading: state.api.loading,
  //     filteredReviews: state.api.filteredReviews,
  //   }),
  //   shallowEqual
  // )
  const zoom = useSelector((state) => state.interface.zoom)
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  const toggleOrbitControls = (isTrue) => {
    if (isTrue) {
      if (!th.controls) {
        th.controls = new OrbitControls(th.camera, th.renderer.domElement)
        th.controls.enableDamping = true
        th.controls.enableRotate = false
        th.controls.mouseButtons.LEFT = THREE.MOUSE.PAN
        th.controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE
        // th.controls.screenSpacePanning = true
        th.controls.panSpeed = 2

        th.controls.maxDistance = 50
        th.controls.minDistance = 5
        th.controls.dampingFactor = 0.05
      }
    } else th.controls = null
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

  const switchControlsForReviewer = () => {
    if (th.controls) {
      th.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE
      th.controls.mouseButtons.RIGHT = null
      th.controls.enableRotate = true
      th.controls.enableZoom = false
    }
  }

  // threejs scene
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textTextures.forEach((textTexture) => {
      textureLoader.load(textTexture, (_texture) => {
        th.textures.push(_texture)
      })
    })

    let mouse = new THREE.Vector2()
    let clicking = false
    let openedAlbum = false
    /**
     * Scene Initial Status
     */

    if (pathname === "/galaxy") {
      console.log("litteraly fogging")
      th.scene.fog = new THREE.Fog(th.fog.color, th.fog.near, Math.max(th.camera.position.z * 1.8, th.fog.far))
    }
    th.camera.position.set(0, 0, 10)

    if (pathname.includes("/reviewer/")) th.camera.position.z = -10
    // console.log("setting camera pos")

    toggleHelp(true)
    setTimeout(() => {
      console.log("enabling orbit")
      toggleOrbitControls(true)
      // toggleTrackBallControls(true)
      th.controls &&
        th.controls.addEventListener("change", () => {
          if (pathname === "/galaxy") {
            // adjusting fog with distance. The goal is having a clear view for afar but be foggy upfront so that the data appears "readable"
            th.scene.fog.far = Math.max(th.camera.position.z * 1.8, th.fog.far)
            // update timeline
          } else if (pathname.includes("/reviewer/")) {
            // th.camera.lookAt(th.sphereGroup)
          }
        })
    }, 100)

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

    let i = 0
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

      if (pathname.includes("/reviewer/")) {
        if (th.sphereGroup.rotation) {
          th.sphereGroup.rotation.y = t / 5000
        }
      }

      // small up and down movement
      if (th.sphereGroup.position) th.sphereGroup.position.y = Math.sin(t / 500) / 50

      // th.sphereInstancedMesh.instanceMatrix.needsUpdate = true

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
  }, [])

  // galaxy scene set up
  useEffect(() => {
    // aka page galaxy has just finished loading and querying reviews
    if (pathname === "/galaxy" && !loading && reviews.length > 0) {
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
      gsap.to(materials, {
        opacity: 1,
        stagger: { amount: 1.2 },
        duration: 0.5,
        onComplete: () => setSpawnDone(true),
      })

      /** Instanced mesh approach, thing is you can't store data for each individual instance. Not even sure that it's better performance wise */
      // th.scene.add(th.sphereInstancedMesh)
      // filteredReviews.forEach((review, index) => {
      //   th.dummy.position.set(Math.random() * 15, Math.random() * 15, Math.random() * 15)
      //   th.dummy.updateMatrix()
      //   th.sphereInstancedMesh.setMatrixAt(index, th.dummy.matrix)
      // })
      // th.scene.add(new THREE.Mesh(th.sphere.geometry, th.sphere.material))
      // console.log(th.scene.children)
    }
  }, [reviews])

  // updating reviews with new filters in galaxy
  useEffect(() => {
    // if albums have been fetched and the initial sphere render is done
    // inplementing debouncing to that the expensive search op is executed less often
    if (pathname === "/galaxy") {
      const timeDiff = Date.now() - lastUpdate
      setLastUpdate(Date.now())
      if (reviews.length > 0 && !loading && spawnDone) {
        const albumNames = filteredReviews.map((review) => review.album)
        th.sphereGroup.children.forEach((sphere) => {
          gsap.to(sphere.material, {
            duration: 0.8,
            ease: "Power2.easeOut",
            opacity: albumNames.includes(sphere.userData.album) ? 1 : 0.16,
          })
        })
      }
    }
  }, [filteredReviews])

  // camera movements in galaxy
  useEffect(() => {
    // adjust camera zoom

    // get the range ( percent of width), mutliply it by width, then divide it by 2 coz we need a triangle for trigo
    let testY = ((zoom[1] - zoom[0]) * th.sceneSize.width) / 100
    testY = testY / 2

    const tanRad = Math.tan(degToRad(fov / 2))
    const tanDeg = tanRad
    // const cameraZ = (rangeMappedToRealWorld[1] - rangeMappedToRealWorld[0]) / tanDeg
    const cameraZ = testY / tanDeg
    // console.log("setting camera z via zoom")
    // th.camera.position.z = cameraZ
    // th.camera.updateProjectionMatrix()
  }, [zoom])

  // REVIEWERDETAIL scene setup
  useEffect(() => {
    if (pathname.includes("/reviewer")) {
      th.scene.position.set(0, 0, 0)
      if (reviews.length) {
        const range = 5
        const variationRo = 0.3
        const variationPhi = 0.7

        // toggleRadialHelp(true)
        switchControlsForReviewer()

        const lineGroup = new THREE.Group()
        const lineMaterial = new THREE.LineBasicMaterial({ color: "white", transparent: true, opacity: 0.4 })
        const points = []
        for (let i = 0; i < 62; i++)
          points.push(new THREE.Vector3().setFromSphericalCoords(range, Math.PI / 2, ((Math.PI * 2) / 64) * i))
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(lineGeometry, lineMaterial)

        lineGroup.add(line)

        const reviewsForReviewer = reviews.filter((_review) => _review.author === activeReviewer.name)

        th.sphereGroup = new THREE.Group()
        th.sphereGroup.name = "sphereGroup"
        th.sphereGroup.rotation.x = degToRad(-12)

        reviewsForReviewer.forEach((review) => {
          const roComputed = gsap.utils.mapRange(0, 10, 0, range, review.score) // radius
          // const roComputed = 5 // radius
          const thetaComputed = dateToYearPercent(review.date, "rad") // x-y angle
          const phiComputed = Math.PI / 2 // z angle
          // const phiComputed = gsap.utils.random(Math.PI / 2 - variationPhi, Math.PI / 2 + variationPhi) // z angle

          const sphere = new THREE.Mesh(
            th.sphere.geometry,
            new THREE.MeshPhongMaterial({
              color: st.genresColors[review.genre],
              transparent: true,
              opacity: 1,
            })
          )
          sphere.position.setFromSphericalCoords(roComputed, phiComputed, thetaComputed)
          sphere.userData = { ...review }
          th.sphereGroup.add(sphere)
        })

        // decoration
        th.sphereGroup.add(lineGroup)

        th.scene.add(th.sphereGroup)
        console.log(th.sphereGroup)
      }
    }
  }, [filteredReviews])

  return <StyledCanvasContainer ref={$canvas} />
}

export default React.memo(THREECanvas)
