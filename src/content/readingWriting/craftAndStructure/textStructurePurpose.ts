import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'craft-and-structure',
  subsection: 'text-structure-purpose',
  title: 'Text Structure and Purpose',
  summary: "Identify why the author wrote a sentence, paragraph, or whole passage the way they did.",
  body: "These questions ask what role a sentence plays (introduce, contrast, support, qualify) or what the author's overall purpose is (inform, persuade, compare, correct a misconception). Identify transition words first — 'however,' 'for example,' 'in contrast,' 'rather than' — since they almost always reveal the structural function directly. For whole-passage purpose questions, look at the first and last sentences; the purpose is often set up at the start and confirmed at the end.",
  tips: [
    "A sentence beginning with 'however' or 'but' is contrasting or complicating the previous idea, not agreeing with it.",
    "'Rather than X, actually Y' signals the author is correcting a simplified or common view.",
    'A passage presenting two sides without favoring either is informative/neutral, not persuasive.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'cs-tsp-1',
    domain: 'craft-and-structure',
    subsection: 'text-structure-purpose',
    difficulty: 'medium',
    passage: "Some critics argue that switching to electric buses is prohibitively expensive for small transit agencies. However, a 2023 study found that maintenance savings over a decade typically offset the higher upfront cost, making the switch cost-neutral for most agencies within ten years.",
    prompt: "Which choice best describes the function of the second sentence in the text?",
    choices: [
      'It introduces a new, unrelated topic.',
      "It presents a counterargument to the first sentence's claim.",
      'It provides evidence that undermines the concern raised in the first sentence.',
      'It restates the first sentence in different words.',
    ],
    correctAnswer: 'It provides evidence that undermines the concern raised in the first sentence.',
    hints: [
      'Look at what the second sentence does relative to the first — agree, contradict, or extend?',
      "The word 'However' signals a shift.",
    ],
    walkthrough: [
      'The first sentence raises a cost concern.',
      "'However' introduces evidence against that concern.",
      'The second sentence functions to undermine the concern, not just restate or contradict in the abstract.',
    ],
  },
  {
    id: 'cs-tsp-2',
    domain: 'craft-and-structure',
    subsection: 'text-structure-purpose',
    difficulty: 'hard',
    passage: "Historians have long debated how the printing press changed European society. Rather than simply making books cheaper, the press fundamentally altered who had access to written knowledge, extending literacy beyond the clergy and nobility.",
    prompt: 'What is the main purpose of the text?',
    choices: [
      "To argue that the printing press's main effect was making books more affordable",
      'To describe the mechanics of early printing presses',
      "To revise a simple view of the press's effects in favor of a broader one",
      'To criticize historians for debating minor details',
    ],
    correctAnswer: "To revise a simple view of the press's effects in favor of a broader one",
    hints: [
      "Look at the phrase 'Rather than simply X, actually Y.'",
      'The passage is correcting a narrower view with a broader claim.',
    ],
    walkthrough: [
      '"Rather than simply X, actually Y" signals a correction of a simple view.',
      'The passage moves from a simple view (cheaper books) to a broader one (access to knowledge).',
      'That correction is the main purpose.',
    ],
  },
  {
    id: 'cs-tsp-3',
    domain: 'craft-and-structure',
    subsection: 'text-structure-purpose',
    difficulty: 'easy',
    passage: "The proposed policy would require all new buildings to include solar panels. Proponents cite long-term energy savings; opponents point to the increased upfront cost for developers. The city council has yet to decide.",
    prompt: 'What is the function of the text as a whole?',
    choices: [
      'To persuade readers that the policy should be adopted',
      'To present both sides of a debate without endorsing one',
      'To describe how solar panels work',
      "To announce the council's final decision",
    ],
    correctAnswer: 'To present both sides of a debate without endorsing one',
    hints: [
      "Notice it presents 'proponents' AND 'opponents' and says a decision is pending.",
      'No conclusion is drawn in favor of either side.',
    ],
    walkthrough: [
      'The text gives both sides\' arguments.',
      "It explicitly notes the decision hasn't been made.",
      'This is neutral presentation, not persuasion.',
    ],
  },
  {
    id: 'cs-tsp-4',
    domain: 'craft-and-structure',
    subsection: 'text-structure-purpose',
    difficulty: 'medium',
    passage: "A 2022 survey found that only 18% of respondents could correctly identify the primary cause of a recent regional drought. In the following section, we outline the three main contributing factors in detail.",
    prompt: 'What is the function of the first sentence in relation to the rest of the text?',
    choices: [
      'It establishes a need that the following section will address.',
      'It contradicts the claim made in the following section.',
      'It summarizes the findings of the following section.',
      'It is unrelated to the following section.',
    ],
    correctAnswer: 'It establishes a need that the following section will address.',
    hints: [
      "Look at the transition 'In the following section, we outline...'",
      'A low-awareness statistic often motivates further explanation.',
    ],
    walkthrough: [
      'The survey shows low public understanding of the cause.',
      'The next sentence promises to explain the causes in detail.',
      'The first sentence sets up the need for that explanation.',
    ],
  },
  {
    id: 'cs-tsp-5',
    domain: 'craft-and-structure',
    subsection: 'text-structure-purpose',
    difficulty: 'medium',
    passage: "Although the experiment produced promising early results, the sample size was too small to draw firm conclusions. A larger follow-up study is planned for next year.",
    prompt: "What is the purpose of the phrase 'the sample size was too small to draw firm conclusions'?",
    choices: [
      "To dismiss the experiment's results entirely",
      'To qualify the significance of the early results',
      "To criticize the researchers' methodology harshly",
      'To explain why the experiment was canceled',
    ],
    correctAnswer: 'To qualify the significance of the early results',
    hints: [
      "The structure is 'promising results, BUT a limitation' — what does that do to the claim?",
      'It does not say the results are wrong, just not yet conclusive.',
    ],
    walkthrough: [
      "The phrase follows 'although... promising' with a limitation.",
      'This qualifies, rather than dismisses, the results.',
      'That matches the choice about qualifying significance.',
    ],
  },
]
