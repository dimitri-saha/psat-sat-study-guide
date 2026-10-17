import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'standard-english-conventions',
  subsection: 'form-structure-sense',
  title: 'Form, Structure, and Sense',
  summary: 'Subject-verb agreement, pronoun agreement, modifier placement, and parallel structure.',
  body: "These questions test whether a sentence's grammar is internally consistent. For subject-verb agreement, find the true subject — ignore any descriptive phrase set off by commas between the subject and the verb. For pronoun agreement, match singular antecedents ('each,' 'everyone,' 'a person') with singular pronouns. For modifiers, the noun right after an introductory phrase must be the thing that phrase actually describes, or you get a dangling modifier. For parallel structure, every item in a list or comparison must use the same grammatical form.",
  tips: [
    "When a comma-set-off phrase sits between the subject and the verb, cross it out mentally — it is never the subject.",
    'An introductory phrase ending in a comma must be immediately followed by the noun it describes.',
    'In a list of actions joined by "and," every item should use the same verb form (all base form, or all -ing, never mixed).',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'sec-fss-1',
    domain: 'standard-english-conventions',
    subsection: 'form-structure-sense',
    difficulty: 'medium',
    prompt: "The collection of rare manuscripts, housed in a climate-controlled room, ______ in the library's possession for over a century. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ['has been', 'have been', 'were', 'are'],
    correctAnswer: 'has been',
    hints: [
      'Find the true subject of the sentence, ignoring the phrase between the commas.',
      "The subject here is singular: 'the collection,' not 'manuscripts.'",
    ],
    walkthrough: [
      "'Housed in a climate-controlled room' is a modifying phrase, not the subject.",
      "The real subject is 'the collection,' which is singular.",
      "'Has been' agrees with the singular subject; the plural forms do not.",
    ],
  },
  {
    id: 'sec-fss-2',
    domain: 'standard-english-conventions',
    subsection: 'form-structure-sense',
    difficulty: 'medium',
    prompt: "Each of the interns submitted ______ final report by the Friday deadline. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ['their', 'his or her', 'its', 'our'],
    correctAnswer: 'his or her',
    hints: [
      "'Each' is a singular indefinite pronoun, even though it refers to multiple interns.",
      'Match the pronoun to a singular antecedent.',
    ],
    walkthrough: [
      "'Each' takes a singular verb and pronoun in Standard English.",
      "'His or her' agrees in number with 'each.'",
      "'Their' and 'our' are plural; 'its' would not refer to people.",
    ],
  },
  {
    id: 'sec-fss-3',
    domain: 'standard-english-conventions',
    subsection: 'form-structure-sense',
    difficulty: 'hard',
    prompt: 'Rushing to catch the last train, ______. Which choice most logically and grammatically completes the sentence?',
    choices: [
      'the suitcase was left behind by Maria',
      'Maria left her suitcase behind',
      'her suitcase was left behind',
      'it was left behind by Maria',
    ],
    correctAnswer: 'Maria left her suitcase behind',
    hints: [
      'The opening phrase describes who was rushing — that person must be the subject right after the comma.',
      "A dangling modifier happens when the thing right after the comma isn't the one doing the action described.",
    ],
    walkthrough: [
      "'Rushing to catch the last train' describes a person, not a suitcase.",
      'The subject immediately following the comma must be that person — Maria.',
      'Only this choice puts Maria right after the comma as the one rushing.',
    ],
  },
  {
    id: 'sec-fss-4',
    domain: 'standard-english-conventions',
    subsection: 'form-structure-sense',
    difficulty: 'medium',
    prompt: "The new policy requires employees to arrive on time, complete their assigned tasks, and ______ before leaving for the day. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ['submitting a daily report', 'a daily report should be submitted', 'submit a daily report', 'they must submit a daily report'],
    correctAnswer: 'submit a daily report',
    hints: [
      "The sentence lists three parallel actions employees must do: 'arrive,' 'complete,' and...",
      'Match the verb form of the third item to the first two — base form, no "-ing," no extra subject.',
    ],
    walkthrough: [
      "The list uses parallel base-form verbs: 'arrive,' 'complete.'",
      "The third item must match that form: 'submit.'",
      "The other choices break the parallel structure with '-ing' or an extra subject.",
    ],
  },
  {
    id: 'sec-fss-5',
    domain: 'standard-english-conventions',
    subsection: 'form-structure-sense',
    difficulty: 'hard',
    prompt: "The award will be given to ______ submits the most innovative proposal. Which choice completes the text so that it conforms to the conventions of Standard English?",
    choices: ['whomever', 'whoever', 'whom', "who's"],
    correctAnswer: 'whoever',
    hints: [
      "Determine whether the pronoun is the subject or object of its own clause 'submits the most innovative proposal,' not of the main sentence.",
      "That clause needs a subject, since 'submits' needs someone to perform the action.",
    ],
    walkthrough: [
      "The pronoun is the subject of 'submits,' not the object of 'to.'",
      "Subject position here requires 'whoever,' not the object form 'whomever.'",
      "'Whom' and 'who's' do not fit grammatically in this subject position.",
    ],
  },
]
