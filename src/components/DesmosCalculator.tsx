import { useEffect, useRef } from 'react'
import type { DesmosConfig } from '../content/types'
import styles from './DesmosCalculator.module.css'

declare global {
  interface Window {
    Desmos: {
      GraphingCalculator: (el: HTMLElement) => {
        setExpression: (expr: { latex: string }) => void
        setMathBounds: (bounds: { left: number; right: number; top: number; bottom: number }) => void
        destroy?: () => void
      }
    }
  }
}

export default function DesmosCalculator({ config }: { config: DesmosConfig }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !window.Desmos) return
    const calculator = window.Desmos.GraphingCalculator(containerRef.current)
    config.expressions.forEach(latex => calculator.setExpression({ latex }))
    if (config.bounds) calculator.setMathBounds(config.bounds)

    return () => {
      calculator.destroy?.()
    }
  }, [config])

  return <div ref={containerRef} className={styles.calculator} role="img" aria-label="Desmos graphing calculator" />
}
