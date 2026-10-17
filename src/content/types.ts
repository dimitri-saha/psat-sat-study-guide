export interface DesmosConfig {
  expressions: string[]
  bounds?: { left: number; right: number; top: number; bottom: number }
}

export interface Question {
  id: string
  domain: string
  subsection: string
  difficulty: 'easy' | 'medium' | 'hard'
  passage?: string
  prompt: string
  choices?: string[]
  correctAnswer: string
  hints: string[]
  walkthrough: string[]
  desmosConfig?: DesmosConfig
}

export interface Lesson {
  domain: string
  subsection: string
  title: string
  summary: string
  body: string
  tips: string[]
  videoId: string
}

export interface SubsectionMeta {
  slug: string
  title: string
}

export interface DomainMeta {
  slug: string
  title: string
  subsections: SubsectionMeta[]
}

export interface SectionMeta {
  slug: 'reading-writing' | 'math'
  title: string
  domains: DomainMeta[]
}

export interface DesmosTopic {
  slug: string
  title: string
  summary: string
  body: string
  tips: string[]
  desmosConfig: DesmosConfig
}
