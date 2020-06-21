import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import ThreePlugin from "./GSAPTHREE"
import styled from "styled-components"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { useLocation } from "react-router-dom"
import { dateToYearPercent, radToDeg, degToRad } from "./utils"
import { setHoveredAlbum } from "../../redux/actions/interfaceActions"
import { cloneDeep } from "lodash"
import Stats from "stats.js"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

gsap.registerPlugin(ThreePlugin)

const StyledCanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -100;
  /* opacity: 0.4; */
`

const vizOptions = {
  width: 70,
  height: 16,
  depth: 60,
}

const fov = 80

const th = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 80),
  renderer: new THREE.WebGLRenderer({
    alpha: false,
    antialias: true,
  }),
  rayCaster: new THREE.Raycaster(),
  axesHelper: new THREE.AxesHelper(10),
  gridHelper: new THREE.GridHelper(200, 200),
  polarGridHelper: new THREE.PolarGridHelper(),

  controls: "",
  sphere: {
    geometry: new THREE.SphereGeometry(0.2, 12, 12),
    material: new THREE.MeshPhongMaterial(),
  },
  sphereGroup: "",
  filteredSphereGroup: "",
}
th.cameraHelper = new THREE.CameraHelper(th.camera)
th.sphere.mesh = new THREE.Mesh(th.sphere.geometry, th.sphere.material)

// th.sphereInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

const THREECanvas = () => {
  const $canvas = useRef(null)
  // const api = useSelector(state => state.api, shallowEqual)
  const reviews = useSelector((state) => state.api.reviews, shallowEqual)
  const loading = useSelector((state) => state.api.loading, shallowEqual)
  const filteredReviews = useSelector((state) => state.api.filteredReviews, shallowEqual)

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

  const toggleControls = (isTrue) => {
    if (isTrue) {
      if (!th.controls) {
        th.controls = new OrbitControls(th.camera, th.renderer.domElement)
        th.controls.enableDamping = true
        th.controls.maxDistance = 50
        th.controls.minDistance = 5
        th.controls.dampingFactor = 0.05
      }
    } else th.controls = null
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

  // threejs scene
  useEffect(() => {
    console.log("running scene")
    let mouse = new THREE.Vector2()
    let clicking = false
    let openedAlbum = false
    /**
     * Scene Initial Status
     */

    th.camera.position.set(0, 0, 0)

    toggleHelp(true)
    setTimeout(() => {
      // toggleControls(true)
    }, 4000)
    console.log(th.camera.position)
    // th.camera.lookAt(th.scene)

    {
      const color = 0x99000000 // black
      const near = 10
      const far = 40
      // th.scene.fog = new THREE.Fog(color, near, far)
    }

    /**
     * Raycasting
     */

    const onMouseMoveHandler = ({ x, y }) => {
      // calculate mouse position in normalized device coordinates : (-1 to +1) for both components
      mouse.x = (x / window.innerWidth) * 2 - 1
      mouse.y = -(y / window.innerHeight) * 2 + 1
    }
    const onMouseDownHandler = () => (clicking = true)
    const onMouseUpHandler = () => (clicking = false)

    /**
     * Lighting
     */

    const hemiLight = new THREE.HemisphereLight("red", "blue")
    th.scene.add(hemiLight)

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

      // update the picking ray with the camera and mouse position
      th.rayCaster.setFromCamera(mouse, th.camera)
      // calculate objects intersecting the picking ray
      const sphereGroup = th.scene.children.filter((child) => child.name === "sphereGroup")
      const intersects = th.rayCaster.intersectObjects(sphereGroup, true)

      $canvas.current.style.cursor = "default"

      if (clicking && intersects.length === 0 && openedAlbum) {
        openedAlbum = false
        dispatch(setHoveredAlbum(null))
      }
      for (var i = 0; i < intersects.length; i++) {
        // console.log("hovering", intersects[0].object.userData.album)
        $canvas.current.style.cursor = "pointer"
        if (clicking) {
          // console.log("clicking :", intersects[0].object.userData.album)
          dispatch(setHoveredAlbum(intersects[0].object.userData))
          openedAlbum = true
          clicking = false
        }
      }

      // i++
      // setTimeout(() => {
      //   if (th.filteredSphereGroup?.children?.length > 0) {
      //     th.filteredSphereGroup.children.forEach((sphere) => {
      //       sphere.position.x += i / 100
      //     })
      //   }
      // }, 5000)

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

  // threejs scene starts
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
            -vizOptions.width / 2,
            vizOptions.width / 2,
            dateToYearPercent(review.date)
          )
          const scoreComputed = gsap.utils.mapRange(1, 10, -vizOptions.height / 2, vizOptions.height / 2, review.score)
          const depthComputed = -Math.random() * vizOptions.depth
          const sphere = new THREE.Mesh(th.sphere.geometry, th.sphere.material)
          sphere.position.set(dateComputed, scoreComputed, depthComputed)
          sphere.userData = { ...review }
          sphereGroup.add(sphere)
        })
        return sphereGroup
      }

      console.log("running create sphere")

      th.sphereGroup = createSpheres()
      // th.sphereGroup = tempGrp
      // th.filteredSphereGroup = cloneDeep(tempGrp)
      th.scene.add(th.sphereGroup)

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

    // inplementing debouncing to that the expensive
    if (pathname === "/galaxy") {
      const timeDiff = Date.now() - lastUpdate
      setLastUpdate(Date.now())
      if (reviews.length > 0 && !loading) {
        const albumNames = filteredReviews.map((review) => review.album)
        th.sphereGroup.children.forEach((sphere) => {
          sphere.visible = albumNames.includes(sphere.userData.album)
        })
      }
    } else if (pathname.includes("/reviewer")) {
    }
  }, [filteredReviews])

  // const removeChildren = () => while(th.scene.children.length) th.scene.remove()

  // camera movements in galaxy
  useEffect(() => {
    // adjust camera zoom

    // get the range ( percent of width), mutliply it by width, then divide it by 2 coz we need a triangle for trigo
    let testY = ((zoom[1] - zoom[0]) * vizOptions.width) / 100
    testY = testY / 2

    const tanRad = Math.tan(degToRad(fov / 2))
    const tanDeg = tanRad
    // const cameraZ = (rangeMappedToRealWorld[1] - rangeMappedToRealWorld[0]) / tanDeg
    const cameraZ = testY / tanDeg
    th.camera.position.z = cameraZ
    th.camera.updateProjectionMatrix()
  }, [zoom])

  // useEffect(() => {
  //   if (!loading && reviews.length > 0) {
  //     const albumNames = filteredReviews.map((review) => review.album)
  //     const childrenToFadeOut = []
  //     th.filteredSphereGroup.children.forEach((sphereChild) => {
  //       // if (albumNames.includes(sphereChild.userData.album)) scaleOut(sphereChild, () => (sphereChild.visible = false))
  //       // sphereChild.visible = albumNames.includes(sphereChild.userData.album)
  //       albumNames.includes(sphereChild.userData.album) && childrenToFadeOut.push(sphereChild)
  //     })
  //     // gsap.to(childrenToFadeOut, {
  //     //   duration: 0.6,
  //     //   three: { scaleX: 0.01, scaleY: 0.01, scaleZ: 0.01 },
  //     //   stagger: 0.07,
  //     // })
  //   }
  // }, [filteredReviews])

  const scaleOut = (threeObject, cb) => {
    const tl = new gsap.timeline({ onComplete: cb() })
    tl.to(threeObject.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.3 })
  }

  return <StyledCanvasContainer ref={$canvas} />
}

export default React.memo(THREECanvas)
