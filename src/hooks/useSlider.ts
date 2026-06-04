import { useState, useEffect, useCallback } from 'react'

interface UseSliderReturn {
  currentIndex: number
  direction:    number
  paused:       boolean
  goNext:  () => void
  goPrev:  () => void
  goTo:    (index: number) => void
  setPaused: (fn: (prev: boolean) => boolean) => void
}

/**
 * Slider hook with auto-play and pause support.
 * Pause is required for WCAG 2.2.2 (Pause, Stop, Hide) compliance —
 * any auto-updating content that moves must be pausable by the user.
 */
export function useSlider(total: number, autoPlayInterval = 6000): UseSliderReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection]       = useState(1)
  const [paused, setPaused]             = useState(false)

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex(prev => (prev + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(prev => (prev - 1 + total) % total)
  }, [total])

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex])

  // Auto-play — stopped when paused or interval is ≤ 0
  useEffect(() => {
    if (autoPlayInterval <= 0 || paused) return
    const timer = setInterval(goNext, autoPlayInterval)
    return () => clearInterval(timer)
  }, [goNext, autoPlayInterval, paused])

  return { currentIndex, direction, paused, goNext, goPrev, goTo, setPaused }
}
