import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'information-and-ideas',
  subsection: 'command-of-evidence',
  title: 'Command of Evidence',
  summary: 'Pick the fact, quote, or data point that most directly backs up a given claim.',
  body: "Command of Evidence questions give you a claim and ask which piece of evidence — textual or quantitative — most directly supports it. The trap choices are usually true, relevant-sounding, or emotionally persuasive, but don't actually measure the specific thing the claim is about. Always restate the claim in your own words first, then ask which option is a direct, measured test of that exact claim, not just a related fact.",
  tips: [
    'Match the evidence to the exact variable in the claim — if the claim is about accidents, you need accident data, not a description of the intervention.',
    'A controlled comparison (with vs. without, before vs. after) is almost always stronger evidence than a single descriptive fact.',
    'Watch for choices that only describe the cause, not the measured effect — those support that something happened, not that it worked.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'ii-coe-1',
    domain: 'information-and-ideas',
    subsection: 'command-of-evidence',
    difficulty: 'medium',
    prompt: "A researcher claims that a city's new bike lanes reduced traffic accidents. Which finding would most support this claim?",
    choices: [
      'The city installed 12 miles of new bike lanes last year.',
      'Reported traffic accidents in the bike lane zones dropped by 30% after installation.',
      'Cyclists reported feeling safer in interviews.',
      'The city also repaved several roads at the same time.',
    ],
    correctAnswer: 'Reported traffic accidents in the bike lane zones dropped by 30% after installation.',
    hints: [
      'Look for the option that directly measures the outcome named in the claim (accidents).',
      'A subjective feeling is not the same as a measured accident rate.',
    ],
    walkthrough: [
      'The claim is specifically about accident reduction.',
      'Only the 30% drop directly measures accidents tied to the bike lanes.',
      'The other options describe the lanes, a feeling, or an unrelated change.',
    ],
  },
  {
    id: 'ii-coe-2',
    domain: 'information-and-ideas',
    subsection: 'command-of-evidence',
    difficulty: 'medium',
    prompt: 'A scientist argues that a particular plant species is drought-resistant. Which evidence best supports this claim?',
    choices: [
      'The plant has small, waxy leaves.',
      'In a controlled trial, the plant survived 60 days without water while similar species died within 20.',
      'The plant is native to a desert region.',
      'Gardeners find the plant easy to grow.',
    ],
    correctAnswer: 'In a controlled trial, the plant survived 60 days without water while similar species died within 20.',
    hints: [
      'Look for a direct experimental test of drought survival.',
      "Native habitat suggests but doesn't prove resistance the way a controlled test does.",
    ],
    walkthrough: [
      'The claim needs direct evidence of surviving drought conditions.',
      'The controlled trial is a direct experiment measuring exactly that.',
      'Leaf shape and habitat are suggestive but not direct evidence.',
    ],
  },
  {
    id: 'ii-coe-3',
    domain: 'information-and-ideas',
    subsection: 'command-of-evidence',
    difficulty: 'hard',
    prompt: "A nutritionist claims that eating breakfast improves students' morning test scores. Which finding would best support this claim?",
    choices: [
      'Most students report liking breakfast foods.',
      'Students who ate breakfast scored on average 10% higher on morning tests than those who skipped it, controlling for other factors.',
      'Breakfast cereals are fortified with vitamins.',
      'Schools began offering free breakfast last year.',
    ],
    correctAnswer: 'Students who ate breakfast scored on average 10% higher on morning tests than those who skipped it, controlling for other factors.',
    hints: [
      'Look for a controlled comparison tied directly to test scores.',
      "A policy change alone doesn't show an effect on scores.",
    ],
    walkthrough: [
      'The claim links breakfast specifically to test performance.',
      'The controlled comparison directly measures that link while ruling out other factors.',
      'The other choices do not connect to measured test performance.',
    ],
  },
  {
    id: 'ii-coe-4',
    domain: 'information-and-ideas',
    subsection: 'command-of-evidence',
    difficulty: 'medium',
    prompt: 'An economist argues remote work increases employee productivity. Which data would most strengthen the claim?',
    choices: [
      'A survey found most employees prefer working from home.',
      "A company's internal output metrics rose 15% after shifting staff to remote work, with no change in staff size or tasks.",
      'Remote employees reported less commuting stress.',
      'More companies began offering remote options last year.',
    ],
    correctAnswer: "A company's internal output metrics rose 15% after shifting staff to remote work, with no change in staff size or tasks.",
    hints: [
      'Look for a measured output change attributable specifically to the remote shift.',
      'Preference and stress are not the same as measured productivity.',
    ],
    walkthrough: [
      'Productivity requires a measurable output change.',
      'The 15% output rise isolates the remote-work shift as the cause.',
      'The other choices are about preference or an unrelated trend.',
    ],
  },
  {
    id: 'ii-coe-5',
    domain: 'information-and-ideas',
    subsection: 'command-of-evidence',
    difficulty: 'hard',
    prompt: "A historian claims a trade route was the primary reason a city became wealthy in the 1300s. Which evidence would most support this claim?",
    choices: [
      'The city had a large population at the time.',
      "Tax records show the majority of the city's revenue came from tariffs on goods passing through along that trade route.",
      'The city built a large cathedral in that century.',
      'Several wars took place near the trade route.',
    ],
    correctAnswer: "Tax records show the majority of the city's revenue came from tariffs on goods passing through along that trade route.",
    hints: [
      'Look for direct financial evidence tying wealth to the trade route.',
      "Population size alone doesn't explain the source of wealth.",
    ],
    walkthrough: [
      'The claim is about the cause of the city\'s wealth.',
      "The tax records directly tie the city's revenue to that specific route.",
      'The other choices are circumstantial, not direct financial evidence.',
    ],
  },
]
