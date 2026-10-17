import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'problem-solving-data-analysis',
  subsection: 'ratios-rates-proportions',
  title: 'Ratios, Rates, and Proportions',
  summary: 'Set up a proportion by keeping matching units in the same position on both sides.',
  body: "A ratio compares two quantities; a rate compares two quantities with different units (like miles and hours). To solve a proportion problem, write both ratios as fractions with the same units in the same position (e.g., flour over sugar on both sides), then cross-multiply to solve for the unknown. For rate problems, find the unit rate first (the amount per single unit of the other quantity), then multiply by however many units you need. For work problems (multiple people/machines working together), the combined rate is the sum of the individual rates.",
  tips: [
    'Always label your units when setting up a ratio — it helps catch a flipped fraction.',
    'Unit rate = total amount ÷ total time (or whatever the second quantity is).',
    'If one worker takes T hours alone, their rate is 1/T of the job per hour; add rates together for multiple workers.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'psda-rrp-1',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'easy',
    prompt: 'A recipe uses flour and sugar in a ratio of 2:3. If the recipe calls for 10 cups of flour, how many cups of sugar are needed?',
    correctAnswer: '15',
    hints: ['Set up a proportion: 2/3 = 10/x.', 'Cross-multiply to solve for x.'],
    walkthrough: ['2/3 = 10/x', 'Cross-multiply: 2x = 30', 'x = 15 cups of sugar'],
  },
  {
    id: 'psda-rrp-2',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'medium',
    prompt: 'A car travels 240 miles in 3 hours at a constant rate. At that same rate, how far will it travel in 5 hours?',
    correctAnswer: '400',
    hints: ['Find the unit rate: miles per hour.', 'Multiply the unit rate by 5 hours.'],
    walkthrough: ['Rate: 240 / 3 = 80 miles per hour', 'Distance in 5 hours: 80 * 5 = 400 miles'],
  },
  {
    id: 'psda-rrp-3',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'medium',
    prompt: 'On a map, 1 inch represents 25 miles. If two cities are 3.5 inches apart on the map, what is the actual distance between them, in miles?',
    correctAnswer: '87.5',
    hints: ['Set up a proportion: 1 inch / 25 miles = 3.5 inches / x miles.', 'Cross-multiply, or just multiply 3.5 by 25 directly since the scale is per inch.'],
    walkthrough: ['Since 1 inch = 25 miles, multiply: 3.5 * 25 = 87.5', 'The actual distance is 87.5 miles'],
  },
  {
    id: 'psda-rrp-4',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'easy',
    prompt: 'If a:b = 3:5 and b = 20, what is the value of a?',
    correctAnswer: '12',
    hints: ['Set up the proportion a/b = 3/5 using the given value of b.', 'Cross-multiply to solve for a.'],
    walkthrough: ['a/20 = 3/5', 'Cross-multiply: 5a = 60', 'a = 12'],
  },
  {
    id: 'psda-rrp-5',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'hard',
    prompt: 'One person can paint a room in 8 hours. If a second person works at the same rate alongside the first, how many hours will it take them to paint the room together?',
    correctAnswer: '4',
    hints: ['Each person paints 1/8 of the room per hour.', 'Add their rates together to find the combined rate, then find the time.'],
    walkthrough: ['Combined rate: 1/8 + 1/8 = 2/8 = 1/4 of the room per hour', 'Time = 1 job / (1/4 per hour) = 4 hours'],
  },
]
