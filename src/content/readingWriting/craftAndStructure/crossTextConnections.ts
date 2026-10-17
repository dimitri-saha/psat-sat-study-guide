import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'craft-and-structure',
  subsection: 'cross-text-connections',
  title: 'Cross-Text Connections',
  summary: 'Compare two short passages on the same topic and determine how they relate.',
  body: "These questions give you two short passages and ask how the second relates to the first: does it support, challenge, offer an alternative interpretation, or address an unrelated point? Identify each passage's specific claim first, in your own words, then compare them directly. Most wrong answers either overstate the relationship ('proves,' 'completely refutes') or misdescribe what the second passage actually does.",
  tips: [
    "Watch for extreme language in answer choices ('proves,' 'completely confirms') — the real relationship is usually more measured.",
    'A study with a different method or sample reaching a different conclusion is a conflict, not an unrelated point.',
    "An author who questions how evidence was gathered (not what it found) is challenging methodology, not the conclusion directly.",
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'cs-ctc-1',
    domain: 'craft-and-structure',
    subsection: 'cross-text-connections',
    difficulty: 'medium',
    passage: "Passage 1: Researcher A argues that social media use among teenagers is strongly linked to increased rates of anxiety, citing surveys showing higher self-reported anxiety among heavy users.\n\nPassage 2: Researcher B contends that the link between social media and anxiety is overstated, noting that most studies rely on self-reported survey data rather than clinical diagnoses, which may not accurately measure anxiety.",
    prompt: "How does Researcher B's argument relate to Researcher A's?",
    choices: [
      "It supports Researcher A's conclusion with additional evidence.",
      "It challenges the methodology underlying Researcher A's evidence.",
      "It is unrelated to Researcher A's claim.",
      'It confirms that social media causes anxiety.',
    ],
    correctAnswer: "It challenges the methodology underlying Researcher A's evidence.",
    hints: [
      'Look at what Researcher B specifically criticizes — the conclusion, or how the evidence was gathered?',
      'B points to a weakness in self-reported survey data specifically.',
    ],
    walkthrough: [
      'Researcher A relies on self-reported survey data.',
      'Researcher B questions the reliability of that type of data.',
      'This is a methodological challenge, not agreement or an unrelated point.',
    ],
  },
  {
    id: 'cs-ctc-2',
    domain: 'craft-and-structure',
    subsection: 'cross-text-connections',
    difficulty: 'medium',
    passage: "Passage 1: One study found that bilingual children performed better on tasks requiring mental flexibility than monolingual peers.\n\nPassage 2: Another study, using a larger and more diverse sample, found no significant difference in mental flexibility between bilingual and monolingual children.",
    prompt: 'What is the relationship between the two studies?',
    choices: [
      "The second study replicates the first study's findings.",
      "The second study's results conflict with the first study's findings.",
      'The two studies measured completely different skills.',
      'The first study is clearly more reliable than the second.',
    ],
    correctAnswer: "The second study's results conflict with the first study's findings.",
    hints: [
      "Compare the conclusions directly: does study two find the same effect as study one?",
      "Focus on what the text actually states, not on assumptions about sample size and reliability.",
    ],
    walkthrough: [
      'Study one found a bilingual advantage.',
      'Study two found no significant difference.',
      'These conclusions directly conflict.',
    ],
  },
  {
    id: 'cs-ctc-3',
    domain: 'craft-and-structure',
    subsection: 'cross-text-connections',
    difficulty: 'hard',
    passage: "Passage 1: Economist X claims that raising the minimum wage in a given city led to measurable job losses in the retail sector within a year.\n\nPassage 2: Economist Y, analyzing the same city's data, found that overall retail employment held steady but hours per worker declined slightly.",
    prompt: "How does Economist Y's finding relate to Economist X's claim?",
    choices: [
      "It fully confirms Economist X's claim.",
      'It offers an alternative interpretation of the same situation.',
      "It is based on a completely different city's data.",
      'It proves Economist X used fabricated data.',
    ],
    correctAnswer: 'It offers an alternative interpretation of the same situation.',
    hints: [
      "Both economists examine the same city and period — what differs is their reading of the outcome.",
      'Y does not say jobs were lost; Y finds a change in hours instead.',
    ],
    walkthrough: [
      "Both researchers examine the same city's data.",
      'X claims job losses; Y instead finds stable employment but fewer hours.',
      'Y reframes the outcome rather than confirming or disproving X outright.',
    ],
  },
  {
    id: 'cs-ctc-4',
    domain: 'craft-and-structure',
    subsection: 'cross-text-connections',
    difficulty: 'medium',
    passage: "Passage 1: A nutrition blog claims that a particular supplement significantly improves athletic endurance, based on testimonials from amateur athletes.\n\nPassage 2: A peer-reviewed clinical trial found no measurable difference in endurance between athletes taking the supplement and those taking a placebo.",
    prompt: 'What is the relationship between the two texts?',
    choices: [
      "The clinical trial supports the blog's claim with stronger evidence.",
      "The clinical trial's rigorous evidence undercuts the blog's testimonial-based claim.",
      'The two texts are discussing unrelated supplements.',
      "The blog's evidence is more reliable because it includes real athletes.",
    ],
    correctAnswer: "The clinical trial's rigorous evidence undercuts the blog's testimonial-based claim.",
    hints: [
      'Compare the type of evidence each text relies on: testimonials vs. a controlled trial.',
      'Consider which type of evidence is generally considered stronger.',
    ],
    walkthrough: [
      'The blog relies on testimonials, a weaker form of evidence.',
      'The clinical trial is controlled and finds no effect.',
      "The trial's stronger evidence undercuts the blog's claim.",
    ],
  },
  {
    id: 'cs-ctc-5',
    domain: 'craft-and-structure',
    subsection: 'cross-text-connections',
    difficulty: 'hard',
    passage: "Passage 1: A city planner argues that building more highways will reduce traffic congestion by increasing road capacity.\n\nPassage 2: A transportation researcher notes that in multiple cities, added highway capacity was followed by increased driving, leaving congestion largely unchanged within a few years.",
    prompt: 'How does the second passage function in relation to the first?',
    choices: [
      "It provides historical evidence that complicates the planner's assumption.",
      "It offers identical reasoning to support the planner's argument.",
      'It is entirely unrelated to highway capacity.',
      "It proves the planner's argument is based on fabricated data.",
    ],
    correctAnswer: "It provides historical evidence that complicates the planner's assumption.",
    hints: [
      "Does the researcher's evidence support or complicate the planner's reasoning?",
      "The key phrase is 'congestion largely unchanged' despite more capacity.",
    ],
    walkthrough: [
      'The planner assumes more capacity reduces congestion.',
      'The researcher shows congestion often stays the same despite added capacity.',
      "This complicates, rather than supports, the planner's assumption.",
    ],
  },
]
