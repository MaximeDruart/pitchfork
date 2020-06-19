import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import ThreePlugin from "./GSAPTHREE"
import styled from "styled-components"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { dateToYearPercent } from "./utils"
import { cloneDeep } from "lodash"

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

const th = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500),
  renderer: new THREE.WebGLRenderer({
    alpha: false,
    antialias: false,
  }),
  rayCaster: new THREE.Raycaster(),
  axesHelper: new THREE.AxesHelper(10),
  gridHelper: new THREE.GridHelper(200, 200),
  polarGridHelper: new THREE.PolarGridHelper(),

  controls: "",
  sphere: {
    geometry: new THREE.SphereGeometry(0.2, 12, 12),
    material: new THREE.MeshNormalMaterial(),
  },
  filteredSphereGroup: "",
}

let sphereGroupAll

// th.sphereInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

const THREECanvas = () => {
  const $canvas = useRef(null)
  const { loading, reviews, filteredReviews } = useSelector((state) => state.api)
  const { pathname } = useLocation()

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
      // th.scene.add(th.polarGridHelper)
    } else {
      th.scene.remove(th.axesHelper)
      th.scene.remove(th.gridHelper)
      // th.scene.remove(th.polarGridHelper)
    }
  }

  // threejs scene
  useEffect(() => {
    let mouse = new THREE.Vector2()
    let clicking = false
    /**
     * Scene Initial Status
     */
    toggleHelp(true)
    toggleControls(true)
    th.camera.position.z = 15

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
     * Renderer
     */
    th.renderer.setSize(window.innerWidth, window.innerHeight)
    th.renderer.setPixelRatio(window.devicePixelRatio)
    th.renderer.setClearAlpha(0)
    $canvas.current.appendChild(th.renderer.domElement)

    const animate = (t) => {
      // camera movements
      th.controls && th.controls.update()

      // update the picking ray with the camera and mouse position
      th.rayCaster.setFromCamera(mouse, th.camera)
      // calculate objects intersecting the picking ray
      const sphereGroup = th.scene.children.filter((child) => child.name === "sphereGroup")
      const intersects = th.rayCaster.intersectObjects(sphereGroup, true)

      for (var i = 0; i < intersects.length; i++) {
        // console.log("hovering", intersects[0].object.userData.album)
        if (clicking) {
          // console.log("clicking :", intersects[0].object.userData.album)
          clicking = false
        }
      }
      // th.sphereInstancedMesh.instanceMatrix.needsUpdate = true

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
  }, [])

  // threejs updates
  useEffect(() => {
    // aka page galaxy has just finished loading and querying reviews
    if (pathname === "/galaxy" && !loading && reviews.length > 0) {
      const createSpheres = () => {
        const sphereGroup = new THREE.Group()
        sphereGroup.name = "sphereGroup"
        filteredReviews.forEach((review) => {
          const dateNumber = gsap.utils.mapRange(
            0,
            20,
            -vizOptions.width / 2,
            vizOptions.width / 2,
            dateToYearPercent(review.date)
          )
          const scoreComputed = gsap.utils.mapRange(1, 10, -vizOptions.height / 2, vizOptions.height / 2, review.score)
          const depthComputed = -Math.random() * vizOptions.depth
          const sphere = new THREE.Mesh(th.sphere.geometry, th.sphere.material)
          sphere.position.set(dateNumber, scoreComputed, depthComputed)
          sphere.userData = { ...review }
          sphereGroup.add(sphere)
        })
        return sphereGroup
      }

      console.log("getting spheres")
      let tempGrp = createSpheres()
      sphereGroupAll = tempGrp
      th.filteredSphereGroup = tempGrp
      console.log(sphereGroupAll == th.filteredSphereGroup, sphereGroupAll === th.filteredSphereGroup)
      th.scene.add(th.filteredSphereGroup)

      {
        const color = 0x000000 // black
        const near = 10
        const far = 15
        th.scene.fog = new THREE.Fog(color, near, far)
      }

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

  // updating reviews with new filters
  // useEffect(() => {
  //   // if albums have been fetched and the initial sphere render is done
  //   if (reviews.length > 0 && !loading) {
  //     const albumNames = filteredReviews.map((review) => review.album)
  //     const copy = cloneDeep(sphereGroupAll)
  //     console.log(copy)
  //     // th.filteredSphereGroup.children = copy.children.filter((sphere) => albumNames.includes(sphere.
  //   }
  // }, [filteredReviews])

  // useEffect(() => {
  //   if (!loading) {
  //     const albumNames = filteredReviews.map((review) => review.album)
  //     th.filteredSphereGroup.children.forEach((sphereChild) => {
  //       sphereChild.visible = albumNames.includes(sphereChild.userData.album)
  //     })
  //   }
  // }, [filteredReviews])

  return <StyledCanvasContainer ref={$canvas} />
}

export default THREECanvas
