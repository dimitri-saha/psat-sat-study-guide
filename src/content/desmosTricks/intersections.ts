import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'intersections',
  title: 'Finding Intersections for Systems of Equations',
  summary: 'Graph both equations and let Desmos show you exactly where they cross.',
  body: "Instead of solving a system of equations algebraically, type each equation into Desmos exactly as given. Desmos draws both lines (or curves) automatically. Click directly on the point where they cross, and Desmos displays its exact coordinates — that point is your solution. This works for any system, including ones with a line and a curve, not just two lines.",
  tips: [
    'Type equations in the same form the question gives them — Desmos accepts y = ... and standard form like 3x + 2y = 12 equally well.',
    'If the lines never appear to cross on screen, drag to zoom out — they may intersect far from the default view.',
    'Click directly on the intersection point (not just near it) to make Desmos display its exact coordinates.',
  ],
  desmosConfig: { expressions: ['y=2x+1', 'y=-x+7'], bounds: { left: -5, right: 10, top: 10, bottom: -5 } },
}
