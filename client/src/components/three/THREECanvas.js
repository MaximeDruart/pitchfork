import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import ThreePlugin from "./GSAPTHREE"
import styled from "styled-components"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { dateToYearPercent } from "./utils"

gsap.registerPlugin(ThreePlugin)

const StyledCanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`
const th = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500),
  renderer: new THREE.WebGLRenderer({
    // alpha : false,
    antialias: false,
  }),
  axesHelper: new THREE.AxesHelper(10),
  gridHelper: new THREE.GridHelper(200, 200),
  polarGridHelper: new THREE.PolarGridHelper(),
  controls: "",
  sphere: {
    geometry: new THREE.SphereGeometry(1, 10, 10),
    material: new THREE.MeshNormalMaterial(),
  },
}
const THREECanvas = () => {
  const $canvas = useRef(null)
  const { loading, reviews } = useSelector((state) => state.api)
  const { pathname } = useLocation()

  // threejs scene
  useEffect(() => {
    const scene = new THREE.Scene()
    // scene.fog = new THREE.Fog("lightblue", 5, 100)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500)
    // using an object so it can be tweened
    let rotateSpeed = { value: 0.008 }
    let rotateCamera = false
    camera.position.z = 5
    const axesHelper = new THREE.AxesHelper(10)
    const gridHelper = new THREE.GridHelper(200, 200)
    const polarGridHelper = new THREE.PolarGridHelper()
    let controls
    const toggleControls = (isTrue) => {
      if (isTrue) {
        if (!controls) {
          rotateCamera = false
          controls = new OrbitControls(camera, renderer.domElement)
          controls.enableDamping = true
          controls.enablePan = false
          controls.maxDistance = 35
          controls.minDistance = 5
          controls.dampingFactor = 0.05
        }
      } else controls = null
    }
    const toggleHelp = (isTrue) => {
      if (isTrue) {
        scene.add(axesHelper)
        scene.add(gridHelper)
        // scene.add(polarGridHelper)
      } else {
        scene.remove(axesHelper)
        scene.remove(gridHelper)
        // scene.remove(polarGridHelper)
      }
    }

    /**
     * Galaxy scene
     */
    const geometry = new THREE.SphereGeometry(1, 10, 10)
    const material = new THREE.MeshNormalMaterial({ color: 0x00ff00 })
    const test = new THREE.Mesh(geometry, material)
    scene.add(test)

    console.log(pathname, loading, reviews.length)
    if (pathname === "/galaxy" && !loading && reviews.length > 0) {
      console.log("creating spheres...")
      const createSpheres = () => {
        const sphereGroup = new THREE.Group()

        reviews.forEach((review) => {
          const { date, score, genre } = review
          const dateNumber = dateToYearPercent(date)
          const sphere = new THREE.Mesh(geometry, material)
          sphere.position.set(dateNumber * 10, score, Math.random() * 5)
          sphere.userData = { score, genre }
          sphereGroup.add(sphere)
        })
        console.log(sphereGroup)
        return sphereGroup
      }

      const grp = createSpheres()
      // scene.add(grp)
      const test = new THREE.Mesh(geometry, material)
      scene.add(test)
    }

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      // alpha: true,
      antialias: false,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearAlpha(0)
    $canvas.current.appendChild(renderer.domElement)

    toggleHelp(true)
    toggleControls(true)

    const animate = (t) => {
      // camera movements
      controls && controls.update()
      if (rotateCamera) {
        camera.position.x =
          camera.position.x * Math.cos(rotateSpeed.value) + camera.position.z * Math.sin(rotateSpeed.value)
        camera.position.z =
          camera.position.z * Math.cos(rotateSpeed.value) - camera.position.x * Math.sin(rotateSpeed.value)
        camera.lookAt(scene.position)
      }

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    const resizeHandler = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", resizeHandler)
    return () => window.removeEventListener("resize", resizeHandler)
  }, [])

  // threejs updates
  useEffect(() => {
    effect
    return () => {
      cleanup
    }
  }, [input])

  return <StyledCanvasContainer ref={$canvas} />
}

export default THREECanvas
