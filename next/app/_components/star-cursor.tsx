"use client"

import { useEffect } from "react"

/*
  This component recreates the old plain-JS cursor trail as a React client
  component. React is only used to mount and clean up the script. The animation
  itself still uses native DOM events, requestAnimationFrame, and real DOM nodes,
  which keeps the behavior close to the original website script.
*/

/*
  STAR_GLYPHS:
  These are the characters randomly chosen for each particle.
  - Add symbols to make the trail more visually varied.
  - Remove symbols to make the trail more consistent.
  - Longer strings like "˖*" take up more space than single-character stars.
*/
const STAR_GLYPHS = ["✭", "✧", "✮", "✬", "˖*", "❁"]

/*
  PARTICLE_LIFESPAN:
  How many animation frames each particle survives.
  - Increase this to make stars linger longer and create a thicker trail.
  - Decrease this to make stars shrink away faster and create a shorter trail.
  - At 60fps, 120 frames is roughly 2 seconds.
*/
const PARTICLE_LIFESPAN = 50

/*
  PARTICLES_PER_MOUSE_MOVE:
  How many particles are spawned for one mousemove event.
  - The first particle always spawns immediately at the event position.
  - The remaining particles are salted across time using PARTICLE_SPAWN_STAGGER_MS.
  - Increase this for a denser trail. Decrease this if it feels too heavy.
*/
const PARTICLES_PER_MOUSE_MOVE = 4

/*
  PARTICLE_SPAWN_STAGGER_MS:
  Delay between the extra particles spawned by one mousemove event.
  - Increase this to spread the spawned particles farther apart in time.
  - Decrease this to make each event feel closer to an instant burst.
  - 0 makes all particles spawn together, which tends to look patchy/clumpy.
*/
const PARTICLE_SPAWN_STAGGER_MS = 8

/*
  PARTICLE_SPEED:
  How far each particle moves every animation frame.
  - Increase this to make stars fall away from the cursor faster.
  - Decrease this to keep stars closer to the cursor path.
  - This multiplies both the downward movement and the sideways angle movement.
*/
const PARTICLE_SPEED = 2

/*
  MAX_EMIT_ANGLE_DEGREES:
  Maximum sideways angle from straight down.
  - 0 means every particle falls straight down.
  - Higher values create more left/right spray.
  - 25 gives subtle randomness without exploding outward too aggressively.
  - Keep this positive; negative values do not create a useful new behavior.
*/
const MAX_EMIT_ANGLE_DEGREES = 60

type Point = {
  x: number
  y: number
}

/*
  Particle:
  - element is the actual <span> added to the page.
  - position is where the star currently lives.
  - velocity is how much it moves each frame.
  - lifeSpan counts down to removal.
  - update moves and shrinks the particle.
  - die removes the DOM element when the particle expires.
*/
type Particle = {
  die: () => void
  element: HTMLSpanElement
  lifeSpan: number
  position: Point
  update: () => void
  velocity: Point
}

/*
  applyProperties:
  Small helper for assigning a group of CSS styles to a particle element.
  Keeping these styles in one object makes the particle appearance easier to
  tweak without hunting through several element.style lines.
*/
const applyProperties = (
  target: HTMLElement,
  properties: Record<string, string>
) => {
  for (const key in properties) {
    target.style.setProperty(key, properties[key])
  }
}

/*
  randomGlyph:
  Picks one random symbol for a particle. This is called once per particle, so
  each star keeps the same symbol for its whole lifetime.
*/
const randomGlyph = () =>
  STAR_GLYPHS[Math.floor(Math.random() * STAR_GLYPHS.length)]

/*
  createParticleVelocity:
  Gives each particle a slightly different downward path.
  The angle is centered on straight down:
  - negative angle pushes left,
  - positive angle pushes right,
  - angle near 0 falls nearly straight down.
*/
const createParticleVelocity = () => {
  const maxAngle = (MAX_EMIT_ANGLE_DEGREES * Math.PI) / 180
  const angle = (Math.random() * 2 - 1) * maxAngle

  return {
    x: Math.sin(angle) * PARTICLE_SPEED,
    y: Math.cos(angle) * PARTICLE_SPEED,
  }
}

export function StarCursor() {
  useEffect(() => {
    /*
      effectsOn:
      Local toggle state for the optional #starToggleButton. The site does not
      currently render that button, but this keeps compatibility with the old
      script if you add one later.
    */
    let effectsOn = true

    /*
      cursor:
      Tracks the current cursor position in page coordinates. pageX/pageY are
      used for mouse movement so the trail still lines up if the page scrolls.
    */
    const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    /*
      particles:
      All currently alive particles. There is intentionally no hard maximum here
      because the original script allowed density to build naturally based on
      movement speed and lifespan.
    */
    const particles: Particle[] = []

    /*
      spawnTimeoutIds:
      The salted follow-up particles use short timeouts. Keeping the IDs lets
      cleanup cancel any pending spawns during hot reloads or unmounts.
    */
    const spawnTimeoutIds: number[] = []

    /*
      makeParticle:
      Creates one star DOM element and its update/die behavior.
      This is the closest equivalent to the original script's Particle function.
    */
    const makeParticle = (x: number, y: number, character: string) => {
      const element = document.createElement("span")

      const particle: Particle = {
        element,
        lifeSpan: PARTICLE_LIFESPAN,
        position: { x, y },
        velocity: createParticleVelocity(),
        update() {
          /*
            Move first, then decrement life. This mirrors the old script and
            makes new particles immediately start drifting downward.
          */
          this.position.x += this.velocity.x
          this.position.y += this.velocity.y
          this.lifeSpan--

          /*
            The scale is lifeSpan / PARTICLE_LIFESPAN:
            - new particles are close to full size,
            - older particles shrink toward 0,
            - changing PARTICLE_LIFESPAN changes how slowly this shrink happens.
          */
          this.element.style.transform = `translate3d(${this.position.x}px,${this.position.y}px,0) scale(${this.lifeSpan / PARTICLE_LIFESPAN})`
        },
        die() {
          this.element.remove()
        },
      }

      element.textContent = character

      /*
        Particle element styling:
        - absolute positioning lets pageX/pageY match the document coordinate system.
        - pointer-events none keeps stars from blocking clicks or hovers.
        - high z-index keeps the trail above the portfolio content.
        - will-change hints that transform will update every frame.
      */
      applyProperties(element, {
        position: "absolute",
        display: "block",
        "pointer-events": "none",
        "z-index": "10000000",
        "font-size": "14.5px",
        "will-change": "transform",
        top: "0",
        left: "0",
      })

      /*
        Draw once before appending. This prevents a one-frame flash at top-left
        because the transform is already set before the element enters the DOM.
      */
      particle.update()
      document.body.appendChild(element)

      return particle
    }

    /*
      addParticle:
      Public-ish helper inside this effect. It chooses the random glyph, creates
      the particle, and stores it so the animation loop can update it.
    */
    const addParticle = (x: number, y: number) => {
      particles.push(makeParticle(x, y, randomGlyph()))
    }

    /*
      updateParticles:
      Runs every animation frame. First it moves/shrinks every particle, then it
      walks backward through the array to remove expired particles safely.
    */
    const updateParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].lifeSpan < 0) {
          particles[i].die()
          particles.splice(i, 1)
        }
      }
    }

    /*
      animationFrameId:
      Stores the active requestAnimationFrame handle so React cleanup can cancel
      it during hot reloads, route changes, or unmounts.
    */
    let animationFrameId = 0

    /*
      loop:
      The animation heartbeat. It schedules the next frame and updates all live
      particles once per paint. Particle creation happens in mouse/touch handlers.
    */
    const loop = () => {
      animationFrameId = window.requestAnimationFrame(loop)
      updateParticles()
    }

    /*
      handleTouchMove:
      Touch devices do not have a cursor, but this preserves the old script's
      behavior by spawning particles under each active touch point.
    */
    const handleTouchMove = (event: TouchEvent) => {
      if (!effectsOn) return

      for (let i = 0; i < event.touches.length; i++) {
        addParticle(event.touches[i].clientX, event.touches[i].clientY)
      }
    }

    /*
      handleMouseMove:
      Main desktop interaction. One particle spawns immediately so the trail is
      anchored to the current mouse event. Extra particles are salted after short
      delays and use the latest cursor position, so they keep coming from the
      cursor instead of appearing as one clumpy stack.
    */
    const handleMouseMove = (event: MouseEvent) => {
      if (!effectsOn) return

      cursor.x = event.pageX
      cursor.y = event.pageY

      addParticle(cursor.x, cursor.y)

      for (let i = 1; i < PARTICLES_PER_MOUSE_MOVE; i++) {
        const timeoutId = window.setTimeout(() => {
          if (effectsOn) {
            addParticle(cursor.x, cursor.y)
          }

          const timeoutIndex = spawnTimeoutIds.indexOf(timeoutId)
          if (timeoutIndex >= 0) {
            spawnTimeoutIds.splice(timeoutIndex, 1)
          }
        }, i * PARTICLE_SPAWN_STAGGER_MS)

        spawnTimeoutIds.push(timeoutId)
      }
    }

    /*
      Optional compatibility toggle:
      If an element with id="starToggleButton" exists, clicking it turns the
      trail on/off. Nothing breaks if the button does not exist.
    */
    const toggleButton = document.getElementById("starToggleButton")
    const handleToggle = () => {
      effectsOn = !effectsOn
    }

    /*
      Attach native listeners. These bypass React's synthetic event system and
      keep the trail close to the original plain-JS implementation.
    */
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchstart", handleTouchMove)
    toggleButton?.addEventListener("click", handleToggle)

    loop()

    return () => {
      /*
        Cleanup matters in Next dev mode because hot reloads can remount client
        components. Without this block, old listeners and particles would stack.
      */
      window.cancelAnimationFrame(animationFrameId)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchstart", handleTouchMove)
      toggleButton?.removeEventListener("click", handleToggle)

      for (const timeoutId of spawnTimeoutIds) {
        window.clearTimeout(timeoutId)
      }

      for (const particle of particles) {
        particle.die()
      }

      particles.length = 0
    }
  }, [])

  /*
    This component renders no JSX. It only installs the cursor trail behavior
    when mounted by the page.
  */
  return null
}
