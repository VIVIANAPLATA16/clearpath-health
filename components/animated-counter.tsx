"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedCounter({
  target,
  duration = 2000,
  className,
}: {
  target: number
  duration?: number
  className?: string
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const animate = () => {
      const start = performance.now()
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setValue(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          animate()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration])

  // gentle live increment after initial animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (started.current) setValue((v) => v + Math.floor(Math.random() * 3))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("es-CO")}
    </span>
  )
}
