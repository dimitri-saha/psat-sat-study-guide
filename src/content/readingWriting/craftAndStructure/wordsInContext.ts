import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'craft-and-structure',
  subsection: 'words-in-context',
  title: 'Words in Context',
  summary: 'Pick the word or phrase that fits the logic of the sentence, not just a common meaning of the blank.',
  body: "These questions give you a sentence with a blank and ask which word or phrase fits best. The trap is picking a word that sounds sophisticated or is a common synonym rather than the word that actually fits the sentence's internal logic. Look for a signal word — 'although,' 'despite,' 'because,' 'rather than' — that tells you whether the blank should contrast with or reinforce the rest of the sentence.",
  tips: [
    "Cover the answer choices and predict your own word for the blank first, then find the closest match.",
    "Contrast words ('although,' 'however,' 'despite') mean the blank's tone should be opposite the surrounding clause.",
    'Cause words (\'because,\' \'since\') mean the blank should logically follow from the reason given.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'cs-wic-1',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'medium',
    prompt: "Despite the committee's _____ efforts to reach a compromise, the two factions remained unable to agree on even the most basic terms of the proposal. Which choice completes the text with the most logical and precise word?",
    choices: ['halfhearted', 'diligent', 'careless', 'brief'],
    correctAnswer: 'diligent',
    hints: [
      "The word 'despite' signals a contrast between the effort and the outcome.",
      'If a strong effort still failed, the blank should mean genuine, sustained effort.',
    ],
    walkthrough: [
      "'Despite' sets up a contrast between effort and failure.",
      "'Diligent' means careful and persistent, fitting a real effort that still failed.",
      'The other choices would not need "despite" to explain the failure.',
    ],
  },
  {
    id: 'cs-wic-2',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'medium',
    prompt: "The CEO's remarks were intentionally _____, leaving investors uncertain about the company's actual financial outlook. Which choice completes the text with the most logical word?",
    choices: ['vague', 'precise', 'enthusiastic', 'detailed'],
    correctAnswer: 'vague',
    hints: [
      'The result is uncertainty among investors — what kind of language causes that?',
      'Precise or detailed language would reduce uncertainty, not increase it.',
    ],
    walkthrough: [
      'Investors were left uncertain after the remarks.',
      'Vague language explains the resulting uncertainty.',
      'Precise and detailed contradict that outcome.',
    ],
  },
  {
    id: 'cs-wic-3',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'hard',
    prompt: "Although the novel received _____ reviews upon its release, it has since become regarded as a classic of the genre. Which choice completes the text with the most logical word?",
    choices: ['glowing', 'tepid', 'enthusiastic', 'unanimous'],
    correctAnswer: 'tepid',
    hints: [
      "'Although' signals a contrast between initial reception and later reputation.",
      "If reviews were already glowing, there'd be no contrast with the later classic status.",
    ],
    walkthrough: [
      "'Although' sets up a contrast with the later classic status.",
      'Glowing, enthusiastic, or unanimous reviews would not need that contrast.',
      'Tepid (lukewarm) reviews followed by later acclaim creates the needed contrast.',
    ],
  },
  {
    id: 'cs-wic-4',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'hard',
    prompt: "The scientist's hypothesis, once considered _____ by her peers, is now supported by a growing body of evidence. Which choice completes the text with the most logical word?",
    choices: ['conventional', 'implausible', 'obvious', 'popular'],
    correctAnswer: 'implausible',
    hints: [
      "'Once considered X, now supported by evidence' signals a shift from doubt to acceptance.",
      'Conventional, obvious, and popular all describe something already accepted.',
    ],
    walkthrough: [
      'The sentence contrasts a past view with the present.',
      'A hypothesis that now needs support was likely doubted before.',
      "'Implausible' fits; the others contradict needing later support.",
    ],
  },
  {
    id: 'cs-wic-5',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'medium',
    prompt: 'Critics praised the film for its _____ pacing, noting that not a single scene felt rushed or dragged out. Which choice completes the text with the most logical word?',
    choices: ['uneven', 'measured', 'frantic', 'erratic'],
    correctAnswer: 'measured',
    hints: [
      "The clue 'not rushed or dragged out' tells you exactly what quality is being praised.",
      'Look for a word meaning steady and controlled, not inconsistent.',
    ],
    walkthrough: [
      'The clue defines the praised quality as neither rushed nor dragged out.',
      "'Measured' means controlled and steady, matching that description.",
      'Uneven, frantic, and erratic all suggest inconsistency.',
    ],
  },
]
