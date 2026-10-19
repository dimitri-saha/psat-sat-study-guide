import { useEffect, useRef } from 'react'
import type { DesmosConfig } from '../content/types'
import styles from './DesmosCalculator.module.css'

interface Calculator {
  setExpression: (expr: { id?: string; latex: string }) => void
  setMathBounds: (bounds: { left: number; right: number; top: number; bottom: number }) => void
  destroy?: () => void
}

declare global {
  interface Window {
    Desmos: {
      GraphingCalculator: (el: HTMLElement, options?: Record<string, unknown>) => Calculator
    }
  }
}

/**
 * An embedded Desmos graphing calculator. With no config it starts blank, so students
 * type the equations themselves; passing a config (now or later) adds those
 * expressions on top of whatever the student has already entered.
 */
export default function DesmosCalculator({ config, tall = false }: { config?: DesmosConfig; tall?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const calculatorRef = useRef<Calculator | null>(null)

  useEffect(() => {
    if (!containerRef.current || !window.Desmos) return
    const calculator = window.Desmos.GraphingCalculator(containerRef.current, { border: false })
    calculatorRef.current = calculator
    return () => {
      calculator.destroy?.()
      calculatorRef.current = null
    }
  }, [])

  useEffect(() => {
    const calculator = calculatorRef.current
    if (!calculator || !config) return
    // Stable ids make re-applying the same config idempotent instead of stacking duplicates.
    config.expressions.forEach((latex, i) => calculator.setExpression({ id: `preset-${i}`, latex }))
    if (config.bounds) calculator.setMathBounds(config.bounds)
  }, [config])

  return (
    <div
      ref={containerRef}
      className={tall ? `${styles.calculator} ${styles.tall}` : styles.calculator}
      role="img"
      aria-label="Desmos graphing calculator"
    />
  )
}
