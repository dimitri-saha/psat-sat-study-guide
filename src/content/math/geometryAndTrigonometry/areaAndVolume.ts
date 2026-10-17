import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'geometry-and-trigonometry',
  subsection: 'area-and-volume',
  title: 'Area and Volume',
  summary: 'Apply the standard area and volume formulas for common shapes.',
  body: "Memorize the core formulas: rectangle area = length × width; triangle area = (1/2) × base × height; circle area = πr^2; cylinder volume = πr^2 × height; cube volume = side^3. When a question gives you a figure made of combined shapes, split it into the simple shapes you know, compute each area or volume separately, then add or subtract as needed. When an answer involves π, leave it in terms of π (e.g., '9pi') unless the question asks for a decimal approximation.",
  tips: [
    'Draw or sketch the figure if one is not given — visualizing the shape prevents formula mix-ups.',
    'For composite figures, break them into rectangles, triangles, and circles you can calculate individually.',
    "Keep track of whether a question wants area (square units) or volume (cubic units) — the units tell you which formula to use.",
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'gt-av-1',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A rectangle has a length of 8 and a width of 5. What is its area?',
    correctAnswer: '40',
    hints: ['Area of a rectangle = length × width.', 'Multiply 8 by 5.'],
    walkthrough: ['Area = length × width', 'Area = 8 × 5 = 40'],
  },
  {
    id: 'gt-av-2',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A circle has a radius of 3. What is its area, in terms of π? (Enter like "9pi".)',
    correctAnswer: '9pi',
    hints: ['Area of a circle = πr^2.', 'Square the radius first, then attach π.'],
    walkthrough: ['Area = πr^2', 'Area = π(3)^2 = 9π'],
    desmosConfig: { expressions: ['(x)^2+(y)^2=9'], bounds: { left: -6, right: 6, top: 6, bottom: -6 } },
  },
  {
    id: 'gt-av-3',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'medium',
    prompt: 'A cylinder has a radius of 2 and a height of 5. What is its volume, in terms of π? (Enter like "20pi".)',
    correctAnswer: '20pi',
    hints: ['Volume of a cylinder = πr^2 × height.', 'Square the radius, then multiply by the height and π.'],
    walkthrough: ['Volume = πr^2 × h', 'Volume = π(2)^2 × 5 = π(4)(5) = 20π'],
  },
  {
    id: 'gt-av-4',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A triangle has a base of 6 and a height of 4. What is its area?',
    correctAnswer: '12',
    hints: ['Area of a triangle = (1/2) × base × height.', 'Multiply 6 by 4, then take half.'],
    walkthrough: ['Area = (1/2) × base × height', 'Area = (1/2) × 6 × 4 = (1/2) × 24 = 12'],
  },
  {
    id: 'gt-av-5',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A cube has a side length of 3. What is its volume?',
    correctAnswer: '27',
    hints: ['Volume of a cube = side^3.', 'Cube the side length: 3 × 3 × 3.'],
    walkthrough: ['Volume = side^3', 'Volume = 3^3 = 27'],
  },
]
