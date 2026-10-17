import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'geometry-and-trigonometry',
  subsection: 'right-triangle-trig-circles',
  title: 'Right Triangle Trigonometry and Circles',
  summary: 'Use the Pythagorean theorem, special right triangles, basic trig ratios, and the circle equation.',
  body: "The Pythagorean theorem a^2 + b^2 = c^2 relates the two legs and hypotenuse of a right triangle. Memorize the common Pythagorean triple 3-4-5 and the special right triangle ratios: in a 30-60-90 triangle, the sides are in ratio 1 : √3 : 2 (short leg : long leg : hypotenuse). The basic trig ratios are sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent; memorize sin(30°) = cos(60°) = 1/2. A circle's equation (x - h)^2 + (y - k)^2 = r^2 has center (h, k) and radius r — graphing it on Desmos instantly shows you the center and radius.",
  tips: [
    'Recognize 3-4-5 and 30-60-90 triangles immediately — they appear constantly and save time over using the Pythagorean theorem from scratch.',
    'In the circle equation (x-h)^2+(y-k)^2=r^2, the radius is the square root of the number on the right side, not the number itself.',
    'sin(30°) = cos(60°) = 1/2 — complementary angles have swapped sine and cosine values.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'gt-rtc-1',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'easy',
    prompt: 'A right triangle has legs of length 3 and 4. What is the length of its hypotenuse?',
    correctAnswer: '5',
    hints: ['Use the Pythagorean theorem: a^2 + b^2 = c^2.', 'This is the well-known 3-4-5 right triangle.'],
    walkthrough: ['3^2 + 4^2 = c^2', '9 + 16 = 25 = c^2', 'c = 5'],
  },
  {
    id: 'gt-rtc-2',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'medium',
    prompt: 'What is sin(30°)? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '1/2',
    hints: ['This is one of the standard special-angle values worth memorizing.', 'Think of the 30-60-90 triangle with sides 1, √3, 2.'],
    walkthrough: ['In a 30-60-90 triangle, the side opposite 30° is the shortest side, 1, and the hypotenuse is 2', 'sin(30°) = opposite/hypotenuse = 1/2'],
  },
  {
    id: 'gt-rtc-3',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'medium',
    prompt: 'A circle is given by the equation (x - 2)^2 + (y + 1)^2 = 16. What is its radius?',
    correctAnswer: '4',
    hints: ['Compare to the standard form (x - h)^2 + (y - k)^2 = r^2.', 'The number on the right side is r^2, not r.'],
    walkthrough: ['r^2 = 16', 'r = 4'],
    desmosConfig: { expressions: ['(x-2)^2+(y+1)^2=16'], bounds: { left: -5, right: 9, top: 7, bottom: -9 } },
  },
  {
    id: 'gt-rtc-4',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'medium',
    prompt: 'What is cos(60°)? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '1/2',
    hints: ['Think of the 30-60-90 triangle with sides 1, √3, 2.', 'cos(60°) = adjacent/hypotenuse using the side adjacent to the 60° angle.'],
    walkthrough: ['In a 30-60-90 triangle, the side adjacent to 60° is the shortest side, 1, and the hypotenuse is 2', 'cos(60°) = adjacent/hypotenuse = 1/2'],
  },
  {
    id: 'gt-rtc-5',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'hard',
    prompt: 'In a 30-60-90 triangle, the short leg has length 5. What is the length of the hypotenuse?',
    correctAnswer: '10',
    hints: ['The side ratios in a 30-60-90 triangle are 1 : √3 : 2 (short leg : long leg : hypotenuse).', 'The hypotenuse is always twice the short leg.'],
    walkthrough: ['Ratio: short leg : hypotenuse = 1 : 2', 'Hypotenuse = 5 × 2 = 10'],
  },
]
