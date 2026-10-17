import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'table-mode',
  title: 'Plugging In Answer Choices by Graphing Both Sides',
  summary: 'Turn an equation with an unknown into two graphs and read the solution off their intersection.',
  body: "When you are unsure how to solve an equation algebraically, or want to double check your answer, graph the left side of the equation as one function and the right side as another. For example, to solve 3x - 7 = 11, graph y = 3x - 7 and y = 11 separately. The x-coordinate where they intersect is the solution to the original equation. This also works well for checking which multiple-choice answer is correct: graph the equation and look at the x-value where it crosses the horizontal line matching each answer choice.",
  tips: [
    'Split any equation into "left side = y" and "right side = y" as two separate expressions.',
    'The x-coordinate of their intersection is always the solution to the original equation.',
    'This trick works especially well for equations that are awkward to solve by hand, like ones mixing variables inside and outside a square root or absolute value.',
  ],
  desmosConfig: { expressions: ['y=3x-7', 'y=11'], bounds: { left: -5, right: 15, top: 20, bottom: -10 } },
}
