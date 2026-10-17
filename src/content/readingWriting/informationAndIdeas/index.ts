import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as centralLesson, questions as centralQuestions } from './centralIdeasDetails'
import { lesson as evidenceLesson, questions as evidenceQuestions } from './commandOfEvidence'
import { lesson as inferenceLesson, questions as inferenceQuestions } from './inferences'

export function registerInformationAndIdeas(): DomainMeta {
  registerContent('information-and-ideas', 'central-ideas-details', centralLesson, centralQuestions)
  registerContent('information-and-ideas', 'command-of-evidence', evidenceLesson, evidenceQuestions)
  registerContent('information-and-ideas', 'inferences', inferenceLesson, inferenceQuestions)
  return {
    slug: 'information-and-ideas',
    title: 'Information and Ideas',
    subsections: [
      { slug: 'central-ideas-details', title: 'Central Ideas and Details' },
      { slug: 'command-of-evidence', title: 'Command of Evidence' },
      { slug: 'inferences', title: 'Inferences' },
    ],
  }
}
