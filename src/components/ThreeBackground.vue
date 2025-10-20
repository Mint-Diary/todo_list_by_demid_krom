<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const canvasRef = ref(null)
let renderer, scene, camera, points, rafId
let start = performance.now()

function init() {
  const canvas = canvasRef.value
  const { innerWidth: w, innerHeight: h } = window

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(w, h)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
  camera.position.z = 60

  // Particles
  const count = 400
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const colorA = new THREE.Color('#60a5fa') // blue-400
  const colorB = new THREE.Color('#a78bfa') // violet-400
  const colorC = new THREE.Color('#34d399') // emerald-400

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    // random sphere-ish distribution
    const r = 30 + Math.random() * 25
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = r * Math.cos(phi)

    const mix = Math.random()
    const c = colorA.clone().lerp(colorB, mix).lerp(colorC, Math.random() * 0.5)
    colors[i3] = c.r
    colors[i3 + 1] = c.g
    colors[i3 + 2] = c.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.7,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)

  const onResize = () => {
    const ww = window.innerWidth
    const hh = window.innerHeight
    camera.aspect = ww / hh
    camera.updateProjectionMatrix()
    renderer.setSize(ww, hh)
  }
  window.addEventListener('resize', onResize)
  // store for cleanup
  init._onResize = onResize

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  function animate() {
    const now = performance.now()
    const t = (now - start) * 0.001

    if (!prefersReduced.matches) {
      points.rotation.y = t * 0.015
      points.rotation.x = Math.sin(t * 0.1) * 0.06
    }

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(animate)
  }

  // pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
    } else if (!rafId) {
      rafId = requestAnimationFrame(animate)
    }
  })

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', init._onResize)
  renderer && renderer.dispose()
  // dispose geometry/material
  if (points) {
    points.geometry.dispose()
    points.material.dispose()
  }
})
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 -z-10 pointer-events-none opacity-70 dark:opacity-60"></canvas>
</template>
