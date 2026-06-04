import { useState, useEffect, useCallback } from 'react'

interface UseSliderReturn {
  currentIndex: number
  direction: number
  goNext: () => void
  goPrev: () => void
  goTo: (index: number) => void
}

export function useSlider(total: number, autoPlayInterval = 6000): UseSliderReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

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

  useEffect(() => {
    if (autoPlayInterval <= 0) return
    const timer = setInterval(goNext, autoPlayInterval)
    return () => clearInterval(timer)
  }, [goNext, autoPlayInterval])

  return { currentIndex, direction, goNext, goPrev, goTo }
}
