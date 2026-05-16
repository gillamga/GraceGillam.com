"use client"

import { useEffect } from "react"

export function InitialScrollReset() {
  useEffect(() => {
    const originalScrollRestoration = window.history.scrollRestoration

    window.history.scrollRestoration = "manual"

    window.requestAnimationFrame(() => {
      if (window.location.hash === "#about") {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`
        )
      }

      window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    })

    return () => {
      window.history.scrollRestoration = originalScrollRestoration
    }
  }, [])

  return null
}
