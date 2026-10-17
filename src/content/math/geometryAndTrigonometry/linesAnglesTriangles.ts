import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'geometry-and-trigonometry',
  subsection: 'lines-angles-triangles',
  title: 'Lines, Angles, and Triangles',
  summary: 'Use angle relationships (supplementary, vertical, triangle sum, exterior angle) to find missing angles.',
  body: "Angles on a straight line sum to 180°. Vertical angles (formed by two intersecting lines, across from each other) are always equal. The three interior angles of any triangle always sum to 180°. The exterior angle of a triangle equals the sum of the two interior angles that are not adjacent to it (the 'remote interior angles'). An isosceles triangle has two equal sides and the two angles opposite those sides are also equal.",
  tips: [
    "When you see a straight line cut by another line, the two angles formed on one side always add to 180°.",
    "Vertical angles (opposite each other at an intersection) are always equal — never assume adjacent angles are equal.",
    'If a triangle has a line extended beyond one vertex, the exterior angle formed equals the sum of the two angles at the other two vertices.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'gt-lat-1',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'easy',
    prompt: 'Two angles that lie on a straight line sum to 180°. If one angle is 65°, what is the other angle?',
    correctAnswer: '115',
    hints: ['Angles on a straight line sum to 180°.', 'Subtract 65 from 180.'],
    walkthrough: ['180 - 65 = 115', 'The other angle is 115°'],
  },
  {
    id: 'gt-lat-2',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'easy',
    prompt: 'A triangle has two angles measuring 50° and 60°. What is the measure of the third angle?',
    correctAnswer: '70',
    hints: ['The three angles of a triangle always sum to 180°.', 'Add the two given angles, then subtract from 180.'],
    walkthrough: ['50 + 60 = 110', '180 - 110 = 70', 'The third angle is 70°'],
  },
  {
    id: 'gt-lat-3',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'easy',
    prompt: 'Two lines intersect, forming vertical angles. If one of the angles measures 40°, what is the measure of the angle vertical to it?',
    correctAnswer: '40',
    hints: ['Vertical angles are always equal to each other.', 'No calculation is needed beyond recognizing this relationship.'],
    walkthrough: ['Vertical angles are always congruent', 'The vertical angle also measures 40°'],
  },
  {
    id: 'gt-lat-4',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'medium',
    prompt: 'A triangle has interior angles of 70° and 50° at two of its vertices. What is the measure of the exterior angle at the third vertex?',
    correctAnswer: '120',
    hints: ['The exterior angle equals the sum of the two remote interior angles.', 'Add the two given angles together.'],
    walkthrough: ['Exterior angle = sum of the two remote interior angles', 'Exterior angle = 70 + 50 = 120°'],
  },
  {
    id: 'gt-lat-5',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'medium',
    prompt: 'An isosceles triangle has a vertex angle of 40° and two equal base angles. What is the measure of each base angle?',
    correctAnswer: '70',
    hints: ['All three angles sum to 180°.', 'Subtract the vertex angle from 180, then divide the remainder equally between the two base angles.'],
    walkthrough: ['180 - 40 = 140', '140 / 2 = 70', 'Each base angle measures 70°'],
  },
]
