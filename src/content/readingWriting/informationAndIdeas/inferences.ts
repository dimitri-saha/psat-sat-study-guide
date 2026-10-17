import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'information-and-ideas',
  subsection: 'inferences',
  title: 'Inferences',
  summary: 'Draw the one conclusion the text logically supports — nothing more, nothing less.',
  body: "Inference questions ask you to go one logical step beyond what the passage states outright, but the correct answer must still be fully supported by the text — not just plausible in the real world. The most common trap is a choice that sounds reasonable but requires information the passage never gives. The second most common trap is a choice that restates a detail instead of drawing a conclusion from it. Build the inference by comparing two pieces of information the passage gives you side by side.",
  tips: [
    "Ask 'what MUST be true if everything in this passage is true?' rather than 'what COULD be true?'",
    'If a passage gives you two measurements (e.g., one variable changed, another stayed flat), the inference usually connects the two.',
    "Reject any choice that introduces a new fact the passage never mentions, even if it sounds reasonable.",
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'ii-inf-1',
    domain: 'information-and-ideas',
    subsection: 'inferences',
    difficulty: 'medium',
    passage: "After the museum replaced its paper maps with a mobile app, staff noticed that visitors who used the app spent, on average, 20 minutes longer exploring exhibits than those who used paper maps, though overall visitor satisfaction scores stayed about the same.",
    prompt: 'Which choice is the most logical inference based on the text?',
    choices: [
      'The mobile app made visitors enjoy the museum more.',
      'Paper maps were removed entirely from the museum.',
      'Spending more time with the app did not necessarily translate into greater enjoyment.',
      'The museum plans to remove the app soon.',
    ],
    correctAnswer: 'Spending more time with the app did not necessarily translate into greater enjoyment.',
    hints: [
      'Compare the two measured outcomes: time spent and satisfaction.',
      'Satisfaction stayed the same despite longer time — what does that suggest?',
    ],
    walkthrough: [
      'App users spent more time but satisfaction did not change.',
      'This suggests extra time alone did not boost satisfaction.',
      'That is the most logical inference; the others go beyond or against the text.',
    ],
  },
  {
    id: 'ii-inf-2',
    domain: 'information-and-ideas',
    subsection: 'inferences',
    difficulty: 'medium',
    passage: "A small bookstore that began hosting weekly author readings saw its evening foot traffic nearly double within three months, even though it made no changes to its hours or inventory.",
    prompt: 'Which inference is best supported by the text?',
    choices: [
      'The readings, not other changes, likely drove the increase in evening traffic.',
      'The bookstore\'s inventory was outdated before the readings began.',
      'Morning foot traffic also increased.',
      'The bookstore will host readings every day soon.',
    ],
    correctAnswer: 'The readings, not other changes, likely drove the increase in evening traffic.',
    hints: [
      'Note what stayed the same (hours, inventory) versus what changed (the readings).',
      "If nothing else changed, what's left to explain the increase?",
    ],
    walkthrough: [
      'The passage states hours and inventory were unchanged.',
      'The only noted change was the weekly readings.',
      'So the readings are the most plausible cause of the increase.',
    ],
  },
  {
    id: 'ii-inf-3',
    domain: 'information-and-ideas',
    subsection: 'inferences',
    difficulty: 'hard',
    passage: "In a study of commuting patterns, researchers found that employees offered a four-day workweek used, on average, the same amount of vacation time as before, but reported significantly less interest in taking additional unpaid leave.",
    prompt: 'Which choice is the most reasonable inference?',
    choices: [
      'Employees disliked the four-day workweek.',
      'The four-day workweek may have reduced employees\' need for extra time off.',
      'Vacation time policies changed along with the workweek.',
      'All employees stopped taking vacation entirely.',
    ],
    correctAnswer: 'The four-day workweek may have reduced employees\' need for extra time off.',
    hints: [
      'Note what changed (interest in extra leave) and what did not (vacation time used).',
      'Think about why reduced interest in additional leave might follow from the schedule change.',
    ],
    walkthrough: [
      'Vacation use stayed the same, but interest in extra unpaid leave dropped.',
      'This suggests the four-day week itself satisfied some of the need for time off.',
      'That is the most supported inference.',
    ],
  },
  {
    id: 'ii-inf-4',
    domain: 'information-and-ideas',
    subsection: 'inferences',
    difficulty: 'medium',
    passage: "A software company's support tickets dropped by 40% in the month following a redesign of its error messages to include specific suggested fixes, rather than generic codes.",
    prompt: 'Which inference does the text most support?',
    choices: [
      'Specific error guidance likely helped users resolve issues without contacting support.',
      'The company reduced its support staff that month.',
      'Users stopped encountering errors in the software.',
      'The redesign introduced new bugs.',
    ],
    correctAnswer: 'Specific error guidance likely helped users resolve issues without contacting support.',
    hints: [
      'Think about what connects more specific error messages to fewer support tickets.',
      'Fewer tickets does not necessarily mean fewer errors occurred.',
    ],
    walkthrough: [
      'The only change mentioned is more specific, actionable error messages.',
      'Support tickets dropped afterward.',
      'The most reasonable inference is that users could now self-resolve issues.',
    ],
  },
  {
    id: 'ii-inf-5',
    domain: 'information-and-ideas',
    subsection: 'inferences',
    difficulty: 'hard',
    passage: "Researchers tracking a wetland restoration project found that bird species diversity increased steadily for the first two years, then leveled off even as water quality continued to improve.",
    prompt: 'Which inference is best supported by the text?',
    choices: [
      'Water quality has no effect on bird diversity.',
      'Factors besides water quality may now be limiting further increases in bird diversity.',
      'The wetland restoration project failed.',
      'Bird diversity will decline in future years.',
    ],
    correctAnswer: 'Factors besides water quality may now be limiting further increases in bird diversity.',
    hints: [
      'Notice that water quality kept improving while diversity plateaued — what does that mismatch suggest?',
      'The text does not say diversity dropped, so avoid a decline claim.',
    ],
    walkthrough: [
      'Diversity rose then leveled off despite continuing water quality gains.',
      'This mismatch suggests something other than water quality is now the limiting factor.',
      'That inference is supported without overstating the evidence.',
    ],
  },
]
