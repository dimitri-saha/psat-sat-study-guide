import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'expression-of-ideas',
  subsection: 'rhetorical-synthesis',
  title: 'Rhetorical Synthesis',
  summary: 'Given a set of notes and a stated goal, pick the sentence that best accomplishes that specific goal.',
  body: "These questions give you several bullet-point notes on a topic and a specific goal (e.g., 'emphasize a contrast,' 'specify a cause'). You must choose the answer choice that best accomplishes that exact goal using the given information — not just any true or well-written sentence. The most common trap is a choice that is accurate and uses the notes correctly but answers a different goal than the one stated.",
  tips: [
    'Reread the stated goal immediately before looking at the choices — do not rely on memory of it.',
    "Eliminate any choice that only restates one bullet point without connecting it to the goal (contrast, cause, specification, etc.).",
    'The correct choice almost always combines or connects information from more than one bullet point.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'eoi-rs-1',
    domain: 'expression-of-ideas',
    subsection: 'rhetorical-synthesis',
    difficulty: 'medium',
    passage: "Notes:\n- Monarch butterflies migrate up to 3,000 miles each year.\n- They navigate using the sun and a magnetic sense.\n- Scientists still don't fully understand how this navigation is inherited.",
    prompt: "The student wants to emphasize the mystery that remains in migration research. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: [
      'Monarch butterflies migrate up to 3,000 miles each year.',
      'Monarchs use both the sun and a magnetic sense to navigate.',
      'Despite traveling thousands of miles using the sun and a magnetic sense, how monarchs inherit this navigational ability remains poorly understood.',
      'Monarch butterflies are known for their long migrations.',
    ],
    correctAnswer: 'Despite traveling thousands of miles using the sun and a magnetic sense, how monarchs inherit this navigational ability remains poorly understood.',
    hints: [
      "Look for the goal word: 'mystery that remains.'",
      'Only one choice directly states that something is still not understood.',
    ],
    walkthrough: [
      'The goal is to emphasize unresolved mystery.',
      'Only this choice explicitly states that how navigation is inherited is poorly understood.',
      'The other choices state facts but do not address the mystery.',
    ],
  },
  {
    id: 'eoi-rs-2',
    domain: 'expression-of-ideas',
    subsection: 'rhetorical-synthesis',
    difficulty: 'medium',
    passage: "Notes:\n- The ancient city of Pompeii was buried by volcanic ash in 79 CE.\n- The ash preserved buildings, artifacts, and even casts of victims in remarkable detail.\n- Excavations continue today, revealing new details about Roman daily life.",
    prompt: 'The writer wants to highlight how the disaster inadvertently preserved historical information. Which choice most effectively accomplishes this goal?',
    choices: [
      'Pompeii was buried by volcanic ash in 79 CE.',
      'Although the eruption destroyed Pompeii, the ash that buried it preserved remarkable details of Roman life for modern excavation.',
      'Excavations of Pompeii are ongoing today.',
      'Pompeii is a well-known ancient Roman city.',
    ],
    correctAnswer: 'Although the eruption destroyed Pompeii, the ash that buried it preserved remarkable details of Roman life for modern excavation.',
    hints: [
      'Look for the idea that destruction led to preservation — an ironic cause-effect.',
      'Only one choice connects the disaster directly to preservation.',
    ],
    walkthrough: [
      'The goal links disaster and preservation together.',
      'Only this choice connects the destructive eruption to detailed preservation.',
      'The others state isolated facts without that connection.',
    ],
  },
  {
    id: 'eoi-rs-3',
    domain: 'expression-of-ideas',
    subsection: 'rhetorical-synthesis',
    difficulty: 'hard',
    passage: "Notes:\n- A city's new recycling program increased recycling rates by 40%.\n- The program included color-coded bins and weekly pickup reminders via text.\n- Officials credit the reminders, not the bins, for most of the improvement.",
    prompt: 'The writer wants to specify which part of the program officials believe was most responsible for the improvement. Which choice best accomplishes this goal?',
    choices: [
      'The city introduced color-coded bins and text reminders.',
      'Recycling rates increased by 40% after the new program began.',
      'Officials attribute most of the 40% increase in recycling specifically to the text reminders, not the bins.',
      "The city's recycling program was considered a success.",
    ],
    correctAnswer: 'Officials attribute most of the 40% increase in recycling specifically to the text reminders, not the bins.',
    hints: [
      'The goal asks which specific part officials credit.',
      'Only one choice names the specific feature officials credit.',
    ],
    walkthrough: [
      'The goal is to specify which feature officials credit.',
      'Only this choice names the text reminders specifically as the credited factor.',
      'The others are vaguer or omit that distinction.',
    ],
  },
  {
    id: 'eoi-rs-4',
    domain: 'expression-of-ideas',
    subsection: 'rhetorical-synthesis',
    difficulty: 'hard',
    passage: "Notes:\n- A company switched its default printing setting to double-sided.\n- Paper usage dropped by 35% within six months.\n- No other changes were made to printing policy.",
    prompt: 'The writer wants to suggest that the default setting change alone likely caused the drop in paper use. Which choice most effectively accomplishes this goal?',
    choices: [
      'The company changed its default printing setting to double-sided.',
      'Paper usage dropped by 35% over six months.',
      'Since no other printing policy changes were made, the drop in paper usage appears to result from the default double-sided setting alone.',
      'The company is interested in reducing paper waste.',
    ],
    correctAnswer: 'Since no other printing policy changes were made, the drop in paper usage appears to result from the default double-sided setting alone.',
    hints: [
      'The goal requires linking the single change to the outcome and ruling out other causes.',
      'Only one choice explicitly notes that no other changes were made.',
    ],
    walkthrough: [
      'The goal is to isolate the setting change as the likely cause.',
      'Only this choice explicitly notes no other changes occurred, strengthening that single cause.',
      'The others omit that crucial ruling-out detail.',
    ],
  },
  {
    id: 'eoi-rs-5',
    domain: 'expression-of-ideas',
    subsection: 'rhetorical-synthesis',
    difficulty: 'medium',
    passage: "Notes:\n- A small library began offering free coding classes for teens.\n- Attendance at the library overall increased by 25% in the same period.\n- The classes were held on weekday afternoons.",
    prompt: 'The writer wants to suggest a possible connection between the coding classes and the rise in overall attendance. Which choice most effectively accomplishes this goal?',
    choices: [
      'The library began offering free coding classes for teens.',
      'Overall library attendance rose by 25% around the time the new coding classes began.',
      'The coding classes were held on weekday afternoons.',
      'The library offers several programs for teens.',
    ],
    correctAnswer: 'Overall library attendance rose by 25% around the time the new coding classes began.',
    hints: [
      'The goal needs to connect the timing of the classes to the attendance rise.',
      'Only one choice ties the two events together in time.',
    ],
    walkthrough: [
      'The goal is to suggest a connection between classes and attendance.',
      'Only this choice links the rise in attendance to the same period the classes began.',
      'The others mention one fact without connecting it to the other.',
    ],
  },
]
