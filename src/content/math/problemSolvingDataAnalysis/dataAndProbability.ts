import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'problem-solving-data-analysis',
  subsection: 'data-and-probability',
  title: 'One- and Two-Variable Data, and Probability',
  summary: 'Compute mean, median, and probability, and compare how spread out different data sets are.',
  body: "The mean is the sum of all values divided by how many there are. The median is the middle value when the data is sorted (average the two middle values if there's an even count). Standard deviation measures how spread out the data is around the mean — a data set with values far from the mean has a higher standard deviation than one where values are clustered close to the mean, even if both have the same mean. Probability of an event = (number of favorable outcomes) / (total number of outcomes). For two-way tables, probability of both conditions = count satisfying both / total count.",
  tips: [
    'Sort the data before finding the median — order matters.',
    'Two data sets can share the same mean but have very different standard deviations if one is more spread out.',
    'For "and" probability questions using a table, always divide by the grand total, not a subgroup total, unless the question specifies a condition.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'psda-dap-1',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'easy',
    prompt: 'What is the mean of the data set: 4, 8, 6, 10, 12?',
    correctAnswer: '8',
    hints: ['Add all the values together first.', 'Divide the sum by the number of values.'],
    walkthrough: ['Sum: 4 + 8 + 6 + 10 + 12 = 40', 'Mean: 40 / 5 = 8'],
  },
  {
    id: 'psda-dap-2',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'easy',
    prompt: 'What is the median of the data set: 3, 7, 9, 2, 5?',
    correctAnswer: '5',
    hints: ['Sort the data from least to greatest first.', 'The median is the middle value of the sorted list.'],
    walkthrough: ['Sorted: 2, 3, 5, 7, 9', 'The middle value is 5'],
  },
  {
    id: 'psda-dap-3',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'medium',
    prompt: 'A bag contains 4 red marbles and 6 blue marbles. If one marble is drawn at random, what is the probability it is red? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '2/5',
    hints: ['Probability = favorable outcomes / total outcomes.', 'There are 10 marbles total.'],
    walkthrough: ['Total marbles: 4 + 6 = 10', 'P(red) = 4 / 10 = 2/5'],
  },
  {
    id: 'psda-dap-4',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'medium',
    prompt: "Data set A: 10, 10, 10, 10, 10. Data set B: 2, 6, 10, 14, 18. Both sets have a mean of 10. Which data set has the greater standard deviation?",
    choices: ['Data set A', 'Data set B', 'They are equal', 'Cannot be determined'],
    correctAnswer: 'Data set B',
    hints: ['Standard deviation measures how far values are spread from the mean.', 'Compare how far each value in each set is from 10.'],
    walkthrough: [
      'Every value in Set A equals the mean, so its spread (standard deviation) is 0.',
      'Set B has values ranging from 2 to 18, far from the mean of 10.',
      'Set B has the greater standard deviation.',
    ],
  },
  {
    id: 'psda-dap-5',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'hard',
    prompt: 'Of 50 students, 30 play a sport, and 10 of those 30 also play a musical instrument. If a student is chosen at random from all 50, what is the probability that the student plays both a sport and an instrument? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '1/5',
    hints: ['Find how many students satisfy both conditions (play both).', 'Divide that count by the total number of students, 50 — not by 30.'],
    walkthrough: ['Students who play both: 10', 'P(both) = 10 / 50 = 1/5'],
  },
]
