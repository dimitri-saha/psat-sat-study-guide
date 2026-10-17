import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'information-and-ideas',
  subsection: 'central-ideas-details',
  title: 'Central Ideas and Details',
  summary: 'Find the one idea a passage is built around, and the details that support it.',
  body: "Every short passage on the SAT is built around one central idea, with the other sentences providing supporting detail, context, or evidence for that idea. Don't confuse a detail — even a prominent one — for the main point. Ask yourself: if I had to summarize this passage in one sentence, what would it say? That sentence is the central idea. A 'detail' question instead asks you to locate one specific fact and report it accurately, without generalizing.",
  tips: [
    'The main idea is usually general enough to cover every sentence in the passage — if a choice only explains part of the passage, it is too narrow.',
    'For detail questions, go back to the exact sentence that contains the fact; do not rely on memory of the whole passage.',
    'Eliminate choices that are true statements but not what the passage is actually about.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'ii-cid-1',
    domain: 'information-and-ideas',
    subsection: 'central-ideas-details',
    difficulty: 'easy',
    passage: "The mimic octopus, discovered in Indonesian waters, can alter not just its color but also its body shape and movement to imitate other sea creatures. Researchers have observed it mimicking lionfish, sea snakes, and flatfish depending on the predator nearby, adjusting its disguise to the specific threat it faces.",
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      'The mimic octopus lives only in Indonesian waters.',
      "The mimic octopus changes its disguise based on which predator is nearby.",
      'Researchers are still unsure how octopuses change color.',
      'Lionfish and sea snakes are dangerous to octopuses.',
    ],
    correctAnswer: 'The mimic octopus changes its disguise based on which predator is nearby.',
    hints: [
      'Look for what the whole passage is about, not just one detail.',
      "The passage emphasizes that the octopus's mimicry choice depends on the predator.",
    ],
    walkthrough: [
      'The passage describes several specific predators the octopus mimics.',
      'The common thread is that the octopus tailors its disguise to the specific threat.',
      'That general point is the main idea; the other choices are too narrow or unsupported.',
    ],
  },
  {
    id: 'ii-cid-2',
    domain: 'information-and-ideas',
    subsection: 'central-ideas-details',
    difficulty: 'medium',
    passage: "When ocean temperatures rise even slightly above normal for an extended period, corals become stressed and expel the colorful algae living in their tissues, a process known as bleaching. Without the algae, which also provide the coral with food through photosynthesis, the coral turns white and becomes more vulnerable to disease.",
    prompt: 'Based on the text, what directly causes coral bleaching?',
    choices: [
      'A lack of sunlight reaching the reef',
      'Prolonged exposure to elevated water temperature',
      'Disease spreading among coral colonies',
      'Overpopulation of algae in coral tissue',
    ],
    correctAnswer: 'Prolonged exposure to elevated water temperature',
    hints: [
      "Find the sentence describing the trigger, before the word 'bleaching' is introduced.",
      "Look at the phrase 'rise even slightly above normal for an extended period.'",
    ],
    walkthrough: [
      'The passage states that a prolonged rise in temperature stresses the coral.',
      'That stress causes the coral to expel its algae — this expulsion is bleaching.',
      'The elevated temperature is the cause; disease and whiteness are effects.',
    ],
  },
  {
    id: 'ii-cid-3',
    domain: 'information-and-ideas',
    subsection: 'central-ideas-details',
    difficulty: 'medium',
    passage: "Ada Lovelace is often credited as the first computer programmer for her notes on Charles Babbage's Analytical Engine. In them, she went beyond describing the machine's mechanics, outlining how it could be programmed to manipulate symbols and numbers to perform tasks beyond simple calculation, anticipating the modern concept of software.",
    prompt: 'Which choice best describes the main point of the text?',
    choices: [
      'Babbage built the first working computer.',
      "Lovelace's notes anticipated the general-purpose capability of modern software.",
      "Lovelace disagreed with Babbage's design choices.",
      'The Analytical Engine was never built.',
    ],
    correctAnswer: "Lovelace's notes anticipated the general-purpose capability of modern software.",
    hints: [
      "Focus on what made Lovelace's contribution notable, not just what the Engine was.",
      'The last clause of the passage states what her notes anticipated.',
    ],
    walkthrough: [
      'The passage says her notes went beyond describing simple calculation.',
      'It explicitly states she anticipated the modern concept of software.',
      'That is the main point; the other choices are not supported or not the focus.',
    ],
  },
  {
    id: 'ii-cid-4',
    domain: 'information-and-ideas',
    subsection: 'central-ideas-details',
    difficulty: 'easy',
    passage: "Urban beekeeping has grown rapidly in cities over the past decade, with hobbyists keeping hives on rooftops and in community gardens. Proponents argue the practice supports local plant pollination, though some ecologists caution that an overabundance of honeybees in dense urban areas can crowd out native pollinator species that are already struggling.",
    prompt: 'According to the text, what concern do some ecologists raise about urban beekeeping?',
    choices: [
      'Honeybees produce less honey in cities.',
      'Rooftop hives are difficult to maintain.',
      'Honeybees may outcompete native pollinators in cities.',
      'Community gardens do not have enough flowers.',
    ],
    correctAnswer: 'Honeybees may outcompete native pollinators in cities.',
    hints: [
      'Look for the sentence introducing a caution or counterpoint.',
      'The concern involves competition, not honey production.',
    ],
    walkthrough: [
      "The passage introduces a counterpoint after 'though some ecologists caution.'",
      'That counterpoint is about native pollinators being crowded out.',
      'This matches the choice about honeybees outcompeting native pollinators.',
    ],
  },
  {
    id: 'ii-cid-5',
    domain: 'information-and-ideas',
    subsection: 'central-ideas-details',
    difficulty: 'hard',
    passage: "A recent study tracking battery storage costs found that prices fell nearly 80 percent over the last decade, driven largely by improvements in manufacturing scale rather than breakthroughs in battery chemistry. The researchers concluded that further cost reductions are likely to come from continued manufacturing efficiency rather than from new materials alone.",
    prompt: 'Which choice best expresses the main finding of the study described in the text?',
    choices: [
      'New battery materials caused most of the recent price drops.',
      'Manufacturing scale, not new chemistry, mainly drove falling battery costs.',
      'Battery storage costs are unlikely to fall further.',
      'Battery chemistry breakthroughs are now rare.',
    ],
    correctAnswer: 'Manufacturing scale, not new chemistry, mainly drove falling battery costs.',
    hints: [
      'Distinguish between what the study found caused the price drop and what might happen next.',
      "Look at the phrase 'driven largely by.'",
    ],
    walkthrough: [
      'The study attributes most of the price drop to manufacturing scale.',
      'It also projects future drops from the same source, not new materials.',
      'This matches the choice naming manufacturing scale as the main driver.',
    ],
  },
]
