import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'expression-of-ideas',
  subsection: 'transitions',
  title: 'Transitions',
  summary: 'Choose the transition word or phrase that matches the actual logical relationship between two sentences.',
  body: "Transition questions test whether you can identify the precise logical relationship between two sentences: cause-and-effect, contrast, addition, concession, or example. Don't rely on 'sounds right' — work out the relationship first in plain terms ('sentence 2 happens because of sentence 1' or 'sentence 2 is surprising given sentence 1'), then pick the transition that matches that exact relationship.",
  tips: [
    "'However'/'nonetheless'/'nevertheless' signal contrast or an unexpected turn.",
    "'As a result'/'consequently'/'therefore' signal a direct cause-and-effect relationship.",
    "'Additionally'/'furthermore' signal simple addition — the two sentences support the same point without contrast.",
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'eoi-tr-1',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'easy',
    prompt: "The bridge has been closed for repairs since March. ______, commuters have had to take a ten-minute detour every day. Which choice completes the text with the most logical transition?",
    choices: ['For example,', 'As a result,', 'In contrast,', 'Similarly,'],
    correctAnswer: 'As a result,',
    hints: [
      'Look for the logical relationship: cause and effect.',
      'The detour is a consequence of the closure.',
    ],
    walkthrough: [
      'The closure causes the need for a detour.',
      "'As a result' signals a consequence.",
      'The others signal example, contrast, or similarity, which do not fit.',
    ],
  },
  {
    id: 'eoi-tr-2',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'medium',
    prompt: "Many assume that older homes are less energy-efficient than new ones. ______, a recent study found that some older homes, once retrofitted, outperform newly built houses. Which choice completes the text with the most logical transition?",
    choices: ['Similarly,', 'For instance,', 'However,', 'Therefore,'],
    correctAnswer: 'However,',
    hints: [
      'The second sentence challenges the assumption in the first.',
      'Look for a contrast word.',
    ],
    walkthrough: [
      'The first sentence states a common assumption.',
      'The second sentence contradicts it with a study finding.',
      "'However' signals that contrast; the others do not.",
    ],
  },
  {
    id: 'eoi-tr-3',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'medium',
    prompt: "The company reduced its marketing budget by 20% last year. ______, its quarterly sales grew by 10%. Which choice completes the text with the most logical transition?",
    choices: ['Nevertheless,', 'Specifically,', 'As a result,', 'In the same way,'],
    correctAnswer: 'Nevertheless,',
    hints: [
      'Despite a budget cut, sales still grew — that is an unexpected outcome.',
      'Look for a contrast or concession word.',
    ],
    walkthrough: [
      'A budget cut would normally suggest sales might suffer.',
      'Sales grew anyway, which is unexpected.',
      "'Nevertheless' signals this unexpected contrast.",
    ],
  },
  {
    id: 'eoi-tr-4',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'easy',
    prompt: "The new vaccine requires only one dose instead of two. ______, it can be stored at room temperature rather than requiring refrigeration. Which choice completes the text with the most logical transition?",
    choices: ['However,', 'Additionally,', 'Otherwise,', 'Conversely,'],
    correctAnswer: 'Additionally,',
    hints: [
      'Both sentences list separate advantages of the vaccine — are they similar or opposite?',
      'Look for a word that simply adds another point.',
    ],
    walkthrough: [
      'Both sentences describe separate benefits.',
      "'Additionally' adds a second advantage to the first.",
      'The other choices are contrast words, which do not fit here.',
    ],
  },
  {
    id: 'eoi-tr-5',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'hard',
    prompt: "Researchers initially believed the chemical was harmless in small doses. ______, further testing revealed it accumulates in soil over time, posing a long-term risk. Which choice completes the text with the most logical transition?",
    choices: ['Likewise,', 'For example,', 'Nonetheless,', 'Consequently,'],
    correctAnswer: 'Nonetheless,',
    hints: [
      'The second sentence reveals something that contradicts the initial belief.',
      'Look for a contrast word signaling new, opposing information.',
    ],
    walkthrough: [
      'The first sentence states an initial, incomplete belief.',
      'The second sentence reveals a contradicting finding from further testing.',
      "'Nonetheless' fits this contrast; the others signal similarity, example, or result.",
    ],
  },
]
