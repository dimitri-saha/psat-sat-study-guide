import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'solving-without-algebra',
  title: 'Solving Equations Without Doing the Algebra',
  summary: 'Graph both sides of any equation and read the solution directly off the intersection point.',
  body: "This is the most general Desmos trick: for any equation, no matter how complicated, graph the left-hand side as y1 and the right-hand side as y2, then find where the two graphs cross. The x-coordinate of that intersection point is the solution — you never had to isolate the variable by hand. This is especially useful under time pressure, or for an equation you don't immediately recognize how to solve algebraically.",
  tips: [
    'This trick works for any equation type: linear, quadratic, absolute value, even equations with the variable on both sides in a complicated way.',
    'If there are two intersection points, the equation has two solutions — check whether the question wants the smaller, larger, or sum of both.',
    'Always sanity-check the intersection x-value by plugging it back into the original equation.',
  ],
  desmosConfig: { expressions: ['y=2(x-3)', 'y=x+1'], bounds: { left: -5, right: 15, top: 15, bottom: -10 } },
}
