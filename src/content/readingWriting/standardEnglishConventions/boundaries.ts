import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'standard-english-conventions',
  subsection: 'boundaries',
  title: 'Boundaries: Clauses, Commas, Semicolons, and Colons',
  summary: 'Learn to tell independent from dependent clauses, and punctuate the boundary between them correctly.',
  body: "An independent clause has a subject and a verb and can stand alone as a complete sentence. A dependent clause also has a subject and a verb, but starts with a word like 'although,' 'because,' or 'when' that makes it unable to stand alone. Two independent clauses can be joined with a period, a semicolon, or a comma plus a coordinating conjunction (and, but, or, so, for, nor, yet) — never with a comma alone (that's a comma splice) and never with no punctuation at all (that's a run-on). A colon can follow a complete independent clause to introduce an explanation, example, or list. A dependent clause attached to an independent clause usually just needs a comma, not a period or semicolon, between them.",
  tips: [
    'Test each half of the sentence on its own: can it stand as a complete sentence by itself? If yes, it is independent.',
    "A comma alone between two independent clauses is always wrong — it's called a comma splice.",
    'A colon must be preceded by a complete independent clause, never by a sentence fragment.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'sec-bd-1',
    domain: 'standard-english-conventions',
    subsection: 'boundaries',
    difficulty: 'medium',
    prompt: "The storm knocked out power across the city, ______ many residents relied on generators for several days. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ['so', 'they', 'and then', 'being that'],
    correctAnswer: 'so',
    hints: [
      'Both parts of the sentence are independent clauses (each could stand alone).',
      'Independent clauses need a comma plus a coordinating conjunction (FANBOYS), a semicolon, or a period — not just any connector.',
    ],
    walkthrough: [
      'Both clauses are independent clauses.',
      "'So' is a coordinating conjunction that correctly follows the comma to join them.",
      "'They,' 'and then,' and 'being that' do not correctly join two independent clauses this way.",
    ],
  },
  {
    id: 'sec-bd-2',
    domain: 'standard-english-conventions',
    subsection: 'boundaries',
    difficulty: 'hard',
    prompt: "______ the bridge had been inspected twice that month, engineers ordered an emergency closure after a crack was discovered. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ['Although', 'Because of', 'Despite', 'Due to'],
    correctAnswer: 'Although',
    hints: [
      'The second clause describes a surprising result given the first part of the sentence.',
      'Look for a subordinating conjunction that introduces a full clause (subject + verb), not a preposition that needs just a noun phrase.',
    ],
    walkthrough: [
      'The first part is a dependent clause contrasted with the main clause.',
      "'Although' is a subordinating conjunction that correctly introduces this full clause and contrast.",
      "'Because of,' 'Despite,' and 'Due to' are prepositions that would need a noun phrase, not a full clause, after them.",
    ],
  },
  {
    id: 'sec-bd-3',
    domain: 'standard-english-conventions',
    subsection: 'boundaries',
    difficulty: 'medium',
    prompt: "The committee reviewed dozens of applications______ only three candidates were selected for interviews. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: [';', ',', '', ', being that'],
    correctAnswer: ';',
    hints: [
      'Check whether both halves are independent clauses that could each stand alone as a sentence.',
      "A comma alone cannot join two independent clauses — that's a comma splice.",
    ],
    walkthrough: [
      'Both halves are independent clauses.',
      'A semicolon can directly join two independent clauses without a conjunction.',
      'A comma alone creates a comma splice; no punctuation creates a run-on; "being that" is nonstandard.',
    ],
  },
  {
    id: 'sec-bd-4',
    domain: 'standard-english-conventions',
    subsection: 'boundaries',
    difficulty: 'hard',
    prompt: "The results surprised everyone on the research team______ fewer than ten percent of the test subjects showed any improvement. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: [':', ', and', ',', ''],
    correctAnswer: ':',
    hints: [
      'The first part is a complete independent clause.',
      'A colon can follow a complete sentence to introduce an explanation of why — exactly what the second part does here.',
    ],
    walkthrough: [
      'The first clause is complete and independent.',
      'The second part explains why the results were surprising.',
      'A colon is the correct way to introduce that explanation; the comma options create a splice or run-on.',
    ],
  },
  {
    id: 'sec-bd-5',
    domain: 'standard-english-conventions',
    subsection: 'boundaries',
    difficulty: 'medium',
    prompt: "Even though the budget had been approved months earlier. The project still stalled due to permitting delays. Which choice best corrects this text?",
    choices: [
      'Even though the budget had been approved months earlier. The project still stalled due to permitting delays.',
      'Even though the budget had been approved months earlier, the project still stalled due to permitting delays.',
      'Even though the budget had been approved months earlier; the project still stalled due to permitting delays.',
      'Even though the budget had been approved months earlier the project still stalled due to permitting delays.',
    ],
    correctAnswer: 'Even though the budget had been approved months earlier, the project still stalled due to permitting delays.',
    hints: [
      "'Even though...' is a dependent clause; it cannot stand alone as a sentence.",
      'A dependent clause needs to be attached to its independent clause, usually with just a comma — not a period or semicolon.',
    ],
    walkthrough: [
      "'Even though the budget had been approved months earlier' is a dependent clause — a fragment on its own.",
      'It must be joined to the following independent clause, typically with a comma.',
      'The second choice joins them correctly; the others leave a fragment or use incorrect punctuation for this boundary.',
    ],
  },
]
