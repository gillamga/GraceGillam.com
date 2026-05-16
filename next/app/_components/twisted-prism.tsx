"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const BASE_RENDERER_WIDTH = 4000
const BASE_RENDERER_HEIGHT = 2600
const MAX_VISIBLE_PRISM_WIDTH = 1120

export function TwistedPrism() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mountNode = mountRef.current
    if (!mountNode) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(100, 1800 / 1300, 0.1, 1000)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })

    renderer.setClearColor(0x000000, 0)
    mountNode.appendChild(renderer.domElement)

    const resizeRenderer = () => {
      const availableWidth = mountNode.clientWidth

      if (availableWidth === 0) return

      const scale = Math.min(1, availableWidth / MAX_VISIBLE_PRISM_WIDTH)
      const rendererWidth = Math.round(BASE_RENDERER_WIDTH * scale)
      const rendererHeight = Math.round(BASE_RENDERER_HEIGHT * scale)

      camera.aspect = rendererWidth / rendererHeight
      camera.updateProjectionMatrix()
      renderer.setSize(rendererWidth, rendererHeight)
    }

    resizeRenderer()
    const resizeObserver = new ResizeObserver(resizeRenderer)
    resizeObserver.observe(mountNode)
    window.addEventListener("resize", resizeRenderer)

    const createTextTexture = (text: string) => {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!

      canvas.width = 2048
      canvas.height = 512

      context.fillStyle = "#000000"
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.font = "bold 180px JetBrains Mono, monospace"
      context.fillStyle = "#00ff41"
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.shadowColor = "#00ff41"
      context.shadowBlur = 24

      context.fillText(text, canvas.width / 2, canvas.height / 2)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = false

      return texture
    }

    const createPrismFaceGeometry = (
      faceIndex: number,
      length: number,
      size: number,
      segments: number,
      twistAmount: number
    ) => {
      const positions: number[] = []
      const uvs: number[] = []
      const indices: number[] = []

      const corners: [number, number][] = [
        [-size / 2, -size / 2],
        [size / 2, -size / 2],
        [size / 2, size / 2],
        [-size / 2, size / 2],
      ]

      const nextFaceIndex = (faceIndex + 1) % 4

      for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const x = (t - 0.5) * length
        const twist = t * twistAmount

        const faceCorners = [corners[faceIndex], corners[nextFaceIndex]]

        for (let j = 0; j < faceCorners.length; j++) {
          const [y, z] = faceCorners[j]

          const rotatedY = y * Math.cos(twist) - z * Math.sin(twist)
          const rotatedZ = y * Math.sin(twist) + z * Math.cos(twist)

          positions.push(x, rotatedY, rotatedZ)

          /*
            u = left-to-right along prism length
            v = top-to-bottom across the face
          */
          uvs.push(t, 1-j)
        }
      }

      for (let i = 0; i < segments; i++) {
        const baseIndex = i * 2

        const a = baseIndex
        const b = baseIndex + 1
        const c = baseIndex + 3
        const d = baseIndex + 2

        indices.push(a, b, c)
        indices.push(a, c, d)
      }

      const geometry = new THREE.BufferGeometry()

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      )

      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))

      geometry.setIndex(indices)
      geometry.computeVertexNormals()

      return geometry
    }

    const createPrismFace = (
      faceIndex: number,
      length: number,
      size: number,
      segments: number,
      twistAmount: number
    ) => {
      const geometry = createPrismFaceGeometry(
        faceIndex,
        length,
        size,
        segments,
        twistAmount
      )

      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      })

      return new THREE.Mesh(geometry, material)
    }

    const createTwistedTextFace = (text: string, face: THREE.Mesh) => {
      const texture = createTextTexture(text)

      const geometry = face.geometry.clone()
      geometry.computeVertexNormals()

      /*
        Push the text face a tiny amount away from the original face.
        This prevents z-fighting while preserving the exact same twisted shape.
      */
      const positionAttribute = geometry.attributes.position
      const normalAttribute = geometry.attributes.normal
      const pushAmount = 0.01

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i)
        const y = positionAttribute.getY(i)
        const z = positionAttribute.getZ(i)

        const nx = normalAttribute.getX(i)
        const ny = normalAttribute.getY(i)
        const nz = normalAttribute.getZ(i)

        positionAttribute.setXYZ(
          i,
          x + nx * pushAmount,
          y + ny * pushAmount,
          z + nz * pushAmount
        )
      }

      positionAttribute.needsUpdate = true
      geometry.computeVertexNormals()

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      })

      const textFace = new THREE.Mesh(geometry, material)

      return textFace
    }

    const prismGroup = new THREE.Group()

    const length = 4
    const size = 0.8
    const segments = 100
    const twistAmount = Math.PI

    const prismFaces: THREE.Mesh[] = []

    for (let i = 0; i < 4; i++) {
      const face = createPrismFace(i, length, size, segments, twistAmount)
      prismFaces.push(face)
      prismGroup.add(face)
    }

    for (const face of prismFaces) {
      const textFace = createTwistedTextFace("Grace Gillam", face)
      prismGroup.add(textFace)
    }

    scene.add(prismGroup)

    let animationFrameId: number

    function animate() {
      animationFrameId = requestAnimationFrame(animate)

      prismGroup.rotation.x += 0.009

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener("resize", resizeRenderer)

      prismGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()

          const material = child.material

          if (Array.isArray(material)) {
            material.forEach((m) => {
              if ("map" in m && m.map) {
                m.map.dispose()
              }

              m.dispose()
            })
          } else {
            if ("map" in material && material.map) {
              material.map.dispose()
            }

            material.dispose()
          }
        }
      })

      renderer.dispose()

      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-[300px] flex items-center justify-center"
    />
  )
}
