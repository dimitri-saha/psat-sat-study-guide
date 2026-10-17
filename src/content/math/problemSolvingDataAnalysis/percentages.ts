import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'problem-solving-data-analysis',
  subsection: 'percentages',
  title: 'Percentages',
  summary: 'Convert percentages to decimals and set up the right equation for increase, decrease, or percent-of.',
  body: "'X% of Y' means multiply Y by X/100. A percent increase means multiply the original value by (1 + rate); a percent decrease means multiply by (1 - rate). To find what percent one number is of another, divide the part by the whole and multiply by 100. To work backward from a final price after a percent change, divide by (1 ± rate) instead of multiplying.",
  tips: [
    "A 25% increase means multiply by 1.25; a 15% decrease means multiply by 0.85.",
    "To reverse a percent change and find the original value, divide the final value by (1 ± rate), don't just apply the opposite percent.",
    'Percent change = (new - old) / old * 100.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'psda-pct-1',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'easy',
    prompt: 'What is 20% of 150?',
    correctAnswer: '30',
    hints: ['Convert 20% to a decimal: 0.20.', 'Multiply 0.20 by 150.'],
    walkthrough: ['20% = 0.20', '0.20 * 150 = 30'],
  },
  {
    id: 'psda-pct-2',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'easy',
    prompt: 'A jacket originally priced at $80 is increased by 25%. What is the new price, in dollars?',
    correctAnswer: '100',
    hints: ['A 25% increase means multiply the original price by 1.25.', '0.25 * 80 is the amount added to the original price.'],
    walkthrough: ['25% of 80 = 0.25 * 80 = 20', 'New price = 80 + 20 = 100'],
  },
  {
    id: 'psda-pct-3',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'medium',
    prompt: '45 is what percent of 180? (Enter your answer as a number, without a percent sign.)',
    correctAnswer: '25',
    hints: ['Divide the part by the whole.', 'Multiply the result by 100 to express it as a percent.'],
    walkthrough: ['45 / 180 = 0.25', '0.25 * 100 = 25%'],
  },
  {
    id: 'psda-pct-4',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'medium',
    prompt: 'A town\'s population grew from 200 to 250. What is the percent increase? (Enter your answer as a number, without a percent sign.)',
    correctAnswer: '25',
    hints: ['Percent change = (new - old) / old * 100.', 'The increase amount is 250 - 200 = 50.'],
    walkthrough: ['Change: 250 - 200 = 50', 'Percent increase: 50 / 200 * 100 = 25%'],
  },
  {
    id: 'psda-pct-5',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'hard',
    prompt: 'After a 15% discount, a jacket costs $68. What was the original price, in dollars?',
    correctAnswer: '80',
    hints: ['A 15% discount means the final price is 85% of the original.', 'Divide the final price by 0.85, rather than adding 15% back to $68.'],
    walkthrough: ['Final price = original * 0.85', '68 = original * 0.85', 'original = 68 / 0.85 = 80'],
  },
]
