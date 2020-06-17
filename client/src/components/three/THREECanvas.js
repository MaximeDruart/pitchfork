import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import ThreePlugin from "./GSAPTHREE"
import styled from "styled-components"
gsap.registerPlugin(ThreePlugin)

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -10;
`

const THREECanvas = () => {
  const $canvas = useRef(null)

  // threejs scene
  useEffect(() => {
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog("lightblue", 5, 100)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500)
    camera.position.set(3, 25, 150)
    // using an object so it can be tweened
    let rotateSpeed = { value: 0.008 }
    let rotateCamera = false

    const axesHelper = new THREE.AxesHelper(10)
    const gridHelper = new THREE.GridHelper(100, 100)

    /**
     * Objects
     */

    const cubeMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(6, 6, 6),
      new THREE.MeshStandardMaterial({
        opacity: 0.8,
        side: THREE.DoubleSide,
        color: 0xb2954d,
        wireframe: true,
      })
    )

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
      } else {
        scene.remove(axesHelper)
        scene.remove(gridHelper)
      }
    }

    // scene transitions

    /**
     * Lights
     */

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    // const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearAlpha(0)
    $canvas.current.appendChild(renderer.domElement)

    let controls

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

  return <CanvasContainer ref={$canvas} />
}

export default THREECanvas
