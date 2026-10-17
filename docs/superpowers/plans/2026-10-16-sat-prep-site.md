# PSAT/SAT Study Guide Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, no-backend React+TypeScript PSAT/SAT study site with lessons, embedded YouTube videos, embedded Desmos, and hand-crafted practice questions (hints + walkthroughs) across all official R&W and Math domains.

**Architecture:** Vite+React+TS SPA with React Router. All content (lessons, questions) lives in typed TS data files under `src/content/`, aggregated by `src/content/index.ts` for nav/progress. Shared page components (`DomainPage`, `SubsectionPage`) render any domain/subsection from that data — no per-subsection page components. Progress is tracked client-side only via `localStorage`.

**Tech Stack:** Vite, React 18, TypeScript, react-router-dom, Vitest + @testing-library/react for tests, plain CSS Modules.

**Spec:** `docs/superpowers/specs/2026-10-16-sat-prep-site-design.md`

## Global Constraints

- No backend, no database, no user accounts — fully static, deployable as static files.
- Progress tracking uses `localStorage` only, keyed by question id.
- 5-8 hand-crafted questions per subsection (this plan uses 5 per subsection, the spec's floor).
- Math questions needing Desmos get a `desmosConfig` and render a `DesmosCalculator` beside the question.
- Lessons embed exactly one curated YouTube video via `youtube.com/embed/{videoId}`.
- Site structure follows: Home, `/reading-writing/:domain/:subsection`, `/math/:domain/:subsection`, `/desmos-tricks/:topic`.

## Review Focus

- A question with no `desmosConfig` must not render an empty/broken Desmos pane — `DesmosCalculator` only mounts when `desmosConfig` is present.
- Grid-in math questions (no `choices`) must render a text input, not a missing/blank choice list.
- Hints must reveal one at a time and never auto-reveal the `correctAnswer` text itself.
- Revisiting a subsection after answering questions must restore prior progress from `localStorage`, not reset it.
- A `correctAnswer` that doesn't exactly match one of its `choices` (string mismatch) must be caught by the content validation test, not silently shipped as an unanswerable question.

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/App.module.css`, `src/index.css`
- Create: `src/components/Layout.tsx`, `src/components/Layout.module.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `<Layout>` component wrapping all routed pages with a top nav (`Home`, `Reading & Writing`, `Math`, `Desmos Tricks`) and an `<Outlet />` for nested routes.

- [ ] **Step 1: Scaffold the Vite React+TS project**

Run:
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

In `vite.config.ts`, add a `test` block so Vitest runs with jsdom:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

Create `src/setupTests.ts`:
```ts
import '@testing-library/jest-dom'
```

Add to `package.json` `scripts`: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test for Layout nav**

```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App shell', () => {
  it('renders nav links to all four top-level sections', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /reading & writing/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^math$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /desmos tricks/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `App` has no nav yet (default Vite template content).

- [ ] **Step 4: Implement Layout and wire it into App**

```tsx
// src/components/Layout.tsx
import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/reading-writing">Reading & Writing</Link>
        <Link to="/math">Math</Link>
        <Link to="/desmos-tricks">Desmos Tricks</Link>
      </nav>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
```

```css
/* src/components/Layout.module.css */
.nav { display: flex; gap: 1.5rem; padding: 1rem 2rem; border-bottom: 1px solid #ddd; }
.content { padding: 2rem; max-width: 960px; margin: 0 auto; }
```

```tsx
// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

function Placeholder({ label }: { label: string }) {
  return <p>{label}</p>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Placeholder label="Home" />} />
        <Route path="*" element={<Placeholder label="Not found" />} />
      </Route>
    </Routes>
  )
}
```

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html src
git commit -m "Scaffold Vite React+TS app with routed layout shell"
```

---

## Task 2: Content Types, Index Aggregator, and Progress Hook

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/registry.ts`
- Create: `src/content/index.ts`
- Create: `src/content/content.test.ts`
- Create: `src/hooks/useProgress.ts`
- Test: `src/hooks/useProgress.test.ts`

**Interfaces:**
- Produces: `Question`, `Lesson`, `DesmosConfig`, `SubsectionMeta`, `DomainMeta`, `SectionMeta` types; `sections: SectionMeta[]`, `getLesson(domainSlug, subsectionSlug): Lesson`, `getQuestions(domainSlug, subsectionSlug): Question[]` from `src/content/index.ts`; `useProgress(subsectionKey: string, questionIds: string[])` hook returning `{ record(id, correct), isAttempted(id), isCorrect(id), correctCount }`.
- Consumes: nothing (foundational task).

- [ ] **Step 1: Write the types**

```ts
// src/content/types.ts
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
```

- [ ] **Step 2: Write the failing content-shape test**

This test guards the Review Focus item "a `correctAnswer` that doesn't match any `choices` entry must be caught automatically." It will stay empty of real content until Tasks 6-14 populate `index.ts`, so write it now against a tiny local fixture to prove the rule, then it keeps validating real content for free once added.

```ts
// src/content/content.test.ts
import { describe, it, expect } from 'vitest'
import { sections, getQuestions } from './index'

describe('content integrity', () => {
  it('every subsection listed in sections has at least 5 questions', () => {
    for (const section of sections) {
      for (const domain of section.domains) {
        for (const sub of domain.subsections) {
          const qs = getQuestions(domain.slug, sub.slug)
          expect(qs.length, `${domain.slug}/${sub.slug} question count`).toBeGreaterThanOrEqual(5)
        }
      }
    }
  })

  it('every question with choices has a correctAnswer that exactly matches one choice', () => {
    for (const section of sections) {
      for (const domain of section.domains) {
        for (const sub of domain.subsections) {
          for (const q of getQuestions(domain.slug, sub.slug)) {
            if (q.choices) {
              expect(q.choices, `${q.id} correctAnswer must be in choices`).toContain(q.correctAnswer)
            }
            expect(q.hints.length, `${q.id} needs at least 1 hint`).toBeGreaterThanOrEqual(1)
            expect(q.walkthrough.length, `${q.id} needs at least 1 walkthrough step`).toBeGreaterThanOrEqual(1)
          }
        }
      }
    }
  })
})
```

- [ ] **Step 3: Write the registry module and a minimal `index.ts` so the test runs (still fails on count)**

Registration/lookup functions live in their own `registry.ts` module (not `index.ts`) so that domain content modules — created in Tasks 6-14 — can import `registerContent` without creating a circular import back through `index.ts`, which is the module that imports *them*.

```ts
// src/content/registry.ts
import type { Lesson, Question } from './types'

const lessonsBySubsection: Record<string, Lesson> = {}
const questionsBySubsection: Record<string, Question[]> = {}

export function registerContent(domainSlug: string, subsectionSlug: string, lesson: Lesson, questions: Question[]) {
  const key = `${domainSlug}/${subsectionSlug}`
  lessonsBySubsection[key] = lesson
  questionsBySubsection[key] = questions
}

export function getLesson(domainSlug: string, subsectionSlug: string): Lesson {
  const lesson = lessonsBySubsection[`${domainSlug}/${subsectionSlug}`]
  if (!lesson) throw new Error(`No lesson registered for ${domainSlug}/${subsectionSlug}`)
  return lesson
}

export function getQuestions(domainSlug: string, subsectionSlug: string): Question[] {
  return questionsBySubsection[`${domainSlug}/${subsectionSlug}`] ?? []
}
```

```ts
// src/content/index.ts
import type { SectionMeta } from './types'

export { getLesson, getQuestions } from './registry'

// Tasks 6-14 each add one import here (a domain's `register*()` function, which
// calls `registerContent` for each of its subsections and returns that domain's
// DomainMeta) and push the result into the matching section's `domains` array below.
export const sections: SectionMeta[] = []
```



- [ ] **Step 4: Run test to verify it fails correctly (empty sections, no false pass)**

Run: `npm run test -- content.test`
Expected: PASS trivially right now since `sections` is empty (no loop body runs) — this is expected at this stage. Note in the commit message that `sections` is populated starting in Task 6; this task only proves the harness compiles and the assertions are correct. Confirm by temporarily pushing a bad fixture:

```ts
// Temporarily append to content.test.ts, run, then delete before committing:
it('TEMP sanity check — remove before commit', () => {
  const bad: Question = { id: 'x', domain: 'd', subsection: 's', difficulty: 'easy', prompt: 'p', choices: ['a', 'b'], correctAnswer: 'c', hints: ['h'], walkthrough: ['w'] }
  expect(bad.choices).not.toContain(bad.correctAnswer) // proves the real assertion direction is correct
})
```

Run it, confirm it passes (proving the mismatch-detection logic is sound), then delete the temporary test before continuing.

- [ ] **Step 5: Write the `useProgress` hook and its failing test first**

```ts
// src/hooks/useProgress.test.ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useProgress } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => localStorage.clear())

  it('starts with nothing attempted', () => {
    const { result } = renderHook(() => useProgress('math/algebra', ['q1', 'q2']))
    expect(result.current.isAttempted('q1')).toBe(false)
    expect(result.current.correctCount).toBe(0)
  })

  it('records a correct answer and persists it across remounts', () => {
    const { result, unmount } = renderHook(() => useProgress('math/algebra', ['q1', 'q2']))
    act(() => result.current.record('q1', true))
    expect(result.current.isAttempted('q1')).toBe(true)
    expect(result.current.isCorrect('q1')).toBe(true)
    expect(result.current.correctCount).toBe(1)
    unmount()

    const { result: result2 } = renderHook(() => useProgress('math/algebra', ['q1', 'q2']))
    expect(result2.current.isCorrect('q1')).toBe(true)
    expect(result2.current.correctCount).toBe(1)
  })

  it('records an incorrect answer as attempted but not correct', () => {
    const { result } = renderHook(() => useProgress('math/algebra', ['q1']))
    act(() => result.current.record('q1', false))
    expect(result.current.isAttempted('q1')).toBe(true)
    expect(result.current.isCorrect('q1')).toBe(false)
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test -- useProgress`
Expected: FAIL — `useProgress` module doesn't exist yet.

- [ ] **Step 7: Implement `useProgress`**

```ts
// src/hooks/useProgress.ts
import { useCallback, useState } from 'react'

interface ProgressRecord {
  attempted: boolean
  correct: boolean
}

type ProgressMap = Record<string, ProgressRecord>

function storageKey(subsectionKey: string) {
  return `sat-prep-progress:${subsectionKey}`
}

function loadProgress(subsectionKey: string): ProgressMap {
  const raw = localStorage.getItem(storageKey(subsectionKey))
  return raw ? JSON.parse(raw) : {}
}

export function useProgress(subsectionKey: string, questionIds: string[]) {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress(subsectionKey))

  const record = useCallback((questionId: string, correct: boolean) => {
    setProgress(prev => {
      const next = { ...prev, [questionId]: { attempted: true, correct } }
      localStorage.setItem(storageKey(subsectionKey), JSON.stringify(next))
      return next
    })
  }, [subsectionKey])

  const isAttempted = useCallback((id: string) => Boolean(progress[id]?.attempted), [progress])
  const isCorrect = useCallback((id: string) => Boolean(progress[id]?.correct), [progress])
  const correctCount = questionIds.filter(id => progress[id]?.correct).length

  return { record, isAttempted, isCorrect, correctCount }
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm run test -- useProgress content.test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/content/types.ts src/content/registry.ts src/content/index.ts src/content/content.test.ts src/hooks/useProgress.ts src/hooks/useProgress.test.ts
git commit -m "Add content types, content index aggregator, and localStorage progress hook"
```

---

## Task 3: DesmosCalculator Component

**Files:**
- Create: `src/components/DesmosCalculator.tsx`
- Create: `src/components/DesmosCalculator.module.css`
- Test: `src/components/DesmosCalculator.test.tsx`

**Interfaces:**
- Consumes: `DesmosConfig` from `src/content/types.ts` (Task 2).
- Produces: `<DesmosCalculator config={DesmosConfig} />` — mounts the Desmos API into a div, loading the script once per page lifetime.

- [ ] **Step 1: Write the failing test using a mocked `window.Desmos`**

```tsx
// src/components/DesmosCalculator.test.tsx
import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DesmosCalculator from './DesmosCalculator'

describe('DesmosCalculator', () => {
  beforeEach(() => {
    // @ts-expect-error test double
    window.Desmos = {
      GraphingCalculator: vi.fn(() => ({
        setExpression: vi.fn(),
        setMathBounds: vi.fn(),
      })),
    }
  })

  it('mounts a Desmos calculator and pushes each expression', async () => {
    const setExpression = vi.fn()
    // @ts-expect-error test double
    window.Desmos.GraphingCalculator = vi.fn(() => ({ setExpression, setMathBounds: vi.fn() }))

    render(<DesmosCalculator config={{ expressions: ['y=2x+1', 'y=x^2'] }} />)

    await waitFor(() => {
      // @ts-expect-error test double
      expect(window.Desmos.GraphingCalculator).toHaveBeenCalled()
      expect(setExpression).toHaveBeenCalledWith({ latex: 'y=2x+1' })
      expect(setExpression).toHaveBeenCalledWith({ latex: 'y=x^2' })
    })
  })

  it('applies bounds when provided', async () => {
    const setMathBounds = vi.fn()
    // @ts-expect-error test double
    window.Desmos.GraphingCalculator = vi.fn(() => ({ setExpression: vi.fn(), setMathBounds }))

    render(<DesmosCalculator config={{ expressions: [], bounds: { left: -10, right: 10, top: 10, bottom: -10 } }} />)

    await waitFor(() => {
      expect(setMathBounds).toHaveBeenCalledWith({ left: -10, right: 10, top: 10, bottom: -10 })
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- DesmosCalculator`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `DesmosCalculator`**

The component assumes `window.Desmos` is already available (loaded via a `<script>` tag in `index.html` — added in this step — so tests can mock `window.Desmos` directly without a network fetch).

```html
<!-- index.html: add inside <head>, after the existing tags -->
<script src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
```

```tsx
// src/components/DesmosCalculator.tsx
import { useEffect, useRef } from 'react'
import type { DesmosConfig } from '../content/types'
import styles from './DesmosCalculator.module.css'

declare global {
  interface Window {
    Desmos: {
      GraphingCalculator: (el: HTMLElement) => {
        setExpression: (expr: { latex: string }) => void
        setMathBounds: (bounds: { left: number; right: number; top: number; bottom: number }) => void
      }
    }
  }
}

export default function DesmosCalculator({ config }: { config: DesmosConfig }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !window.Desmos) return
    const calculator = window.Desmos.GraphingCalculator(containerRef.current)
    config.expressions.forEach(latex => calculator.setExpression({ latex }))
    if (config.bounds) calculator.setMathBounds(config.bounds)
  }, [config])

  return <div ref={containerRef} className={styles.calculator} role="img" aria-label="Desmos graphing calculator" />
}
```

```css
/* src/components/DesmosCalculator.module.css */
.calculator { width: 100%; height: 320px; border: 1px solid #ccc; border-radius: 4px; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- DesmosCalculator`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html src/components/DesmosCalculator.tsx src/components/DesmosCalculator.module.css src/components/DesmosCalculator.test.tsx
git commit -m "Add DesmosCalculator component backed by the Desmos API"
```

Note: the API key above is Desmos's publicly documented demo key (used throughout their own examples). It works for development; swap it for a key registered at `desmos.com/api` before any real production deploy — add a reminder in the project README during Task 15.

---

## Task 4: Lesson View and Practice (Question Flow) Components

**Files:**
- Create: `src/components/LessonView.tsx`, `src/components/LessonView.module.css`
- Create: `src/components/Practice.tsx`, `src/components/Practice.module.css`
- Test: `src/components/LessonView.test.tsx`
- Test: `src/components/Practice.test.tsx`

**Interfaces:**
- Consumes: `Lesson`, `Question` types (Task 2); `useProgress` hook (Task 2); `DesmosCalculator` (Task 3).
- Produces: `<LessonView lesson={Lesson} />`; `<Practice subsectionKey={string} questions={Question[]} />` — renders one question at a time with hint/submit/walkthrough/next controls, wired to `useProgress`.

- [ ] **Step 1: Write the failing LessonView test**

```tsx
// src/components/LessonView.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LessonView from './LessonView'
import type { Lesson } from '../content/types'

const lesson: Lesson = {
  domain: 'algebra',
  subsection: 'linear-equations-one-variable',
  title: 'Linear Equations in One Variable',
  summary: 'Solve for x by isolating the variable.',
  body: 'Distribute, combine like terms, then isolate x.',
  tips: ['Always do the same operation to both sides.'],
  videoId: 'abc123XYZ',
}

describe('LessonView', () => {
  it('renders title, body, tips, and the embedded video', () => {
    render(<LessonView lesson={lesson} />)
    expect(screen.getByRole('heading', { name: lesson.title })).toBeInTheDocument()
    expect(screen.getByText(lesson.body)).toBeInTheDocument()
    expect(screen.getByText(lesson.tips[0])).toBeInTheDocument()
    const iframe = screen.getByTitle(/video/i) as HTMLIFrameElement
    expect(iframe.src).toContain('youtube.com/embed/abc123XYZ')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- LessonView`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement LessonView**

```tsx
// src/components/LessonView.tsx
import type { Lesson } from '../content/types'
import styles from './LessonView.module.css'

export default function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article>
      <h1>{lesson.title}</h1>
      <p className={styles.summary}>{lesson.summary}</p>
      <p>{lesson.body}</p>
      <div className={styles.tips}>
        <h2>Tips</h2>
        <ul>
          {lesson.tips.map(tip => <li key={tip}>{tip}</li>)}
        </ul>
      </div>
      <iframe
        title={`${lesson.title} video`}
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${lesson.videoId}`}
        allowFullScreen
      />
    </article>
  )
}
```

```css
/* src/components/LessonView.module.css */
.summary { font-style: italic; color: #555; }
.tips { background: #f5f5f5; border-radius: 4px; padding: 1rem; margin: 1rem 0; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- LessonView`
Expected: PASS

- [ ] **Step 5: Write the failing Practice test — covers the Review Focus items for hints, grid-ins, and no-Desmos-when-absent**

```tsx
// src/components/Practice.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Practice from './Practice'
import type { Question } from '../content/types'

const mcQuestion: Question = {
  id: 'alg-1',
  domain: 'algebra',
  subsection: 'linear-equations-one-variable',
  difficulty: 'easy',
  prompt: 'Solve for x: 3(x - 4) = 2x + 5',
  choices: ['11', '17', '-17', '7'],
  correctAnswer: '17',
  hints: ['Distribute the 3 first.', 'Collect x terms on one side.'],
  walkthrough: ['3x - 12 = 2x + 5', 'x - 12 = 5', 'x = 17'],
}

const gridInQuestion: Question = {
  id: 'alg-2',
  domain: 'algebra',
  subsection: 'linear-equations-one-variable',
  difficulty: 'easy',
  prompt: 'If 5x - 7 = 2x + 8, what is the value of x?',
  correctAnswer: '5',
  hints: ['Move the x terms to one side.'],
  walkthrough: ['3x = 15', 'x = 5'],
}

describe('Practice', () => {
  beforeEach(() => localStorage.clear())

  it('reveals hints one at a time without showing the answer', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByText(mcQuestion.hints[1])).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /get a hint/i }))
    expect(screen.getByText(mcQuestion.hints[0])).toBeInTheDocument()
    expect(screen.queryByText(mcQuestion.hints[1])).not.toBeInTheDocument()
    expect(screen.queryByText(/correct answer is/i)).not.toBeInTheDocument() // the reveal-answer text only appears after submit, not from a hint
    fireEvent.click(screen.getByRole('button', { name: /get a hint/i }))
    expect(screen.getByText(mcQuestion.hints[1])).toBeInTheDocument()
  })

  it('renders choice buttons for multiple-choice questions and grades on submit', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    fireEvent.click(screen.getByRole('button', { name: '17' }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/correct/i)).toBeInTheDocument()
  })

  it('renders a text input for grid-in questions with no choices', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[gridInQuestion]} />)
    expect(screen.queryByRole('button', { name: /^5$/ })).not.toBeInTheDocument()
    const input = screen.getByRole('textbox', { name: /your answer/i })
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/correct/i)).toBeInTheDocument()
  })

  it('does not render a Desmos pane when desmosConfig is absent', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByRole('img', { name: /desmos graphing calculator/i })).not.toBeInTheDocument()
  })

  it('shows the walkthrough only after the button is clicked', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByText(mcQuestion.walkthrough[0])).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '17' }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /show walkthrough/i }))
    expect(screen.getByText(mcQuestion.walkthrough[0])).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test -- Practice`
Expected: FAIL — module doesn't exist.

- [ ] **Step 7: Implement Practice**

```tsx
// src/components/Practice.tsx
import { useState } from 'react'
import type { Question } from '../content/types'
import { useProgress } from '../hooks/useProgress'
import DesmosCalculator from './DesmosCalculator'
import styles from './Practice.module.css'

export default function Practice({ subsectionKey, questions }: { subsectionKey: string; questions: Question[] }) {
  const { record, correctCount } = useProgress(subsectionKey, questions.map(q => q.id))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState('')
  const [hintsShown, setHintsShown] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [showWalkthrough, setShowWalkthrough] = useState(false)

  const question = questions[index]

  function handleSubmit() {
    const correct = selected.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
    setWasCorrect(correct)
    setSubmitted(true)
    record(question.id, correct)
  }

  function handleNext() {
    setIndex(i => Math.min(i + 1, questions.length - 1))
    setSelected('')
    setHintsShown(0)
    setSubmitted(false)
    setShowWalkthrough(false)
  }

  return (
    <div className={styles.practice}>
      <p className={styles.progress}>{correctCount} / {questions.length} correct so far</p>
      {question.passage && <p className={styles.passage}>{question.passage}</p>}
      <div className={styles.questionArea}>
        <div>
          <p className={styles.prompt}>{question.prompt}</p>
          {question.choices ? (
            <div className={styles.choices}>
              {question.choices.map(choice => (
                <button
                  key={choice}
                  className={selected === choice ? styles.selected : ''}
                  onClick={() => setSelected(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <input
              aria-label="Your answer"
              value={selected}
              onChange={e => setSelected(e.target.value)}
            />
          )}
          <div className={styles.actions}>
            <button onClick={() => setHintsShown(h => Math.min(h + 1, question.hints.length))}>
              Get a hint
            </button>
            <button onClick={handleSubmit} disabled={!selected}>Submit</button>
          </div>
          {hintsShown > 0 && (
            <ul className={styles.hints}>
              {question.hints.slice(0, hintsShown).map(hint => <li key={hint}>{hint}</li>)}
            </ul>
          )}
          {submitted && (
            <p className={wasCorrect ? styles.correct : styles.incorrect}>
              {wasCorrect ? 'Correct!' : `Not quite. The correct answer is ${question.correctAnswer}.`}
            </p>
          )}
          {submitted && (
            <button onClick={() => setShowWalkthrough(true)}>Show walkthrough</button>
          )}
          {showWalkthrough && (
            <ol className={styles.walkthrough}>
              {question.walkthrough.map(step => <li key={step}>{step}</li>)}
            </ol>
          )}
          {submitted && index < questions.length - 1 && (
            <button onClick={handleNext}>Next question</button>
          )}
        </div>
        {question.desmosConfig && <DesmosCalculator config={question.desmosConfig} />}
      </div>
    </div>
  )
}
```

```css
/* src/components/Practice.module.css */
.questionArea { display: flex; gap: 1.5rem; }
.choices { display: flex; flex-direction: column; gap: 0.5rem; margin: 0.75rem 0; }
.selected { outline: 2px solid #2563eb; }
.correct { color: #15803d; }
.incorrect { color: #b91c1c; }
.hints { color: #555; }
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test -- Practice`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/LessonView.tsx src/components/LessonView.module.css src/components/LessonView.test.tsx src/components/Practice.tsx src/components/Practice.module.css src/components/Practice.test.tsx
git commit -m "Add LessonView and Practice question-flow components"
```

---

## Task 5: Home, Overview Pages, and Routing

**Files:**
- Create: `src/pages/Home.tsx`
- Create: `src/pages/SectionOverview.tsx` (lists domains for `reading-writing` or `math`)
- Create: `src/pages/DomainPage.tsx` (lists subsections for one domain)
- Create: `src/pages/SubsectionPage.tsx` (tabs between LessonView and Practice)
- Modify: `src/App.tsx` (full route tree, replacing the Task 1 placeholder)
- Test: `src/pages/SubsectionPage.test.tsx`
- Test: `src/pages/SectionOverview.test.tsx`

**Interfaces:**
- Consumes: `sections`, `getLesson`, `getQuestions` from `src/content/index.ts` (Task 2); `LessonView`, `Practice` (Task 4).
- Produces: full route tree mounted in `App.tsx`: `/`, `/reading-writing`, `/reading-writing/:domainSlug`, `/reading-writing/:domainSlug/:subsectionSlug`, `/math`, `/math/:domainSlug`, `/math/:domainSlug/:subsectionSlug`, `/desmos-tricks` (placeholder route to `<Placeholder />` until Task 14), `/desmos-tricks/:topicSlug` (same).

- [ ] **Step 1: Write the failing SectionOverview test**

```tsx
// src/pages/SectionOverview.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import SectionOverview from './SectionOverview'

vi.mock('../content/index', () => ({
  sections: [
    {
      slug: 'math',
      title: 'Math',
      domains: [
        { slug: 'algebra', title: 'Algebra', subsections: [{ slug: 'linear-equations-one-variable', title: 'Linear Equations in One Variable' }] },
      ],
    },
  ],
}))

describe('SectionOverview', () => {
  it('lists domains for the current section with links', () => {
    render(
      <MemoryRouter initialEntries={['/math']}>
        <Routes>
          <Route path="/:sectionSlug" element={<SectionOverview />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /math/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /algebra/i })).toHaveAttribute('href', '/math/algebra')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- SectionOverview`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement SectionOverview and DomainPage**

```tsx
// src/pages/SectionOverview.tsx
import { Link, useParams } from 'react-router-dom'
import { sections } from '../content/index'

export default function SectionOverview() {
  const { sectionSlug } = useParams<{ sectionSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  if (!section) return <p>Section not found.</p>

  return (
    <div>
      <h1>{section.title}</h1>
      <ul>
        {section.domains.map(domain => (
          <li key={domain.slug}>
            <Link to={`/${section.slug}/${domain.slug}`}>{domain.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

```tsx
// src/pages/DomainPage.tsx
import { Link, useParams } from 'react-router-dom'
import { sections } from '../content/index'

export default function DomainPage() {
  const { sectionSlug, domainSlug } = useParams<{ sectionSlug: string; domainSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  const domain = section?.domains.find(d => d.slug === domainSlug)
  if (!section || !domain) return <p>Domain not found.</p>

  return (
    <div>
      <h1>{domain.title}</h1>
      <ul>
        {domain.subsections.map(sub => (
          <li key={sub.slug}>
            <Link to={`/${section.slug}/${domain.slug}/${sub.slug}`}>{sub.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- SectionOverview`
Expected: PASS

- [ ] **Step 5: Write the failing SubsectionPage test**

```tsx
// src/pages/SubsectionPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import SubsectionPage from './SubsectionPage'

vi.mock('../content/index', () => ({
  getLesson: () => ({
    domain: 'algebra', subsection: 'linear-equations-one-variable',
    title: 'Linear Equations', summary: 'Solve for x.', body: 'Isolate the variable.',
    tips: ['Balance both sides.'], videoId: 'abc123',
  }),
  getQuestions: () => [{
    id: 'alg-1', domain: 'algebra', subsection: 'linear-equations-one-variable', difficulty: 'easy',
    prompt: 'Solve: x + 1 = 2', choices: ['1', '2'], correctAnswer: '1',
    hints: ['Subtract 1.'], walkthrough: ['x = 1'],
  }],
}))

describe('SubsectionPage', () => {
  it('defaults to the Lesson tab and switches to Practice on click', () => {
    render(
      <MemoryRouter initialEntries={['/math/algebra/linear-equations-one-variable']}>
        <Routes>
          <Route path="/:sectionSlug/:domainSlug/:subsectionSlug" element={<SubsectionPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /linear equations/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /practice/i }))
    expect(screen.getByText(/solve: x \+ 1 = 2/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm run test -- SubsectionPage`
Expected: FAIL — module doesn't exist.

- [ ] **Step 7: Implement SubsectionPage**

```tsx
// src/pages/SubsectionPage.tsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLesson, getQuestions } from '../content/index'
import LessonView from '../components/LessonView'
import Practice from '../components/Practice'

export default function SubsectionPage() {
  const { domainSlug, subsectionSlug } = useParams<{ domainSlug: string; subsectionSlug: string }>()
  const [tab, setTab] = useState<'lesson' | 'practice'>('lesson')
  if (!domainSlug || !subsectionSlug) return <p>Not found.</p>

  const lesson = getLesson(domainSlug, subsectionSlug)
  const questions = getQuestions(domainSlug, subsectionSlug)

  return (
    <div>
      <div role="tablist">
        <button onClick={() => setTab('lesson')} aria-pressed={tab === 'lesson'}>Lesson</button>
        <button onClick={() => setTab('practice')} aria-pressed={tab === 'practice'}>Practice</button>
      </div>
      {tab === 'lesson'
        ? <LessonView lesson={lesson} />
        : <Practice subsectionKey={`${domainSlug}/${subsectionSlug}`} questions={questions} />}
    </div>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm run test -- SubsectionPage`
Expected: PASS

- [ ] **Step 9: Write Home and wire the full route tree into App.tsx**

```tsx
// src/pages/Home.tsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>PSAT/SAT Study Guide</h1>
      <p>
        The digital SAT has two sections: Reading & Writing and Math. Each is scored
        200-800, for a combined 400-1600. Pick a section below, work through the lesson
        for a subsection, then practice with hints and full walkthroughs.
      </p>
      <ul>
        <li><Link to="/reading-writing">Reading & Writing</Link></li>
        <li><Link to="/math">Math</Link></li>
        <li><Link to="/desmos-tricks">Desmos Tricks</Link></li>
      </ul>
    </div>
  )
}
```

```tsx
// src/App.tsx — replaces the Task 1 version
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SectionOverview from './pages/SectionOverview'
import DomainPage from './pages/DomainPage'
import SubsectionPage from './pages/SubsectionPage'
import DesmosTricksHub from './pages/DesmosTricksHub'
import DesmosTopicPage from './pages/DesmosTopicPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="desmos-tricks" element={<DesmosTricksHub />} />
        <Route path="desmos-tricks/:topicSlug" element={<DesmosTopicPage />} />
        <Route path=":sectionSlug" element={<SectionOverview />} />
        <Route path=":sectionSlug/:domainSlug" element={<DomainPage />} />
        <Route path=":sectionSlug/:domainSlug/:subsectionSlug" element={<SubsectionPage />} />
        <Route path="*" element={<p>Not found.</p>} />
      </Route>
    </Routes>
  )
}
```

This references `DesmosTricksHub` and `DesmosTopicPage`, which don't exist until Task 14. Create temporary stubs now so the app compiles; Task 14 replaces them with real implementations.

```tsx
// src/pages/DesmosTricksHub.tsx (temporary stub, replaced in Task 14)
export default function DesmosTricksHub() {
  return <p>Desmos Tricks coming soon.</p>
}
```

```tsx
// src/pages/DesmosTopicPage.tsx (temporary stub, replaced in Task 14)
export default function DesmosTopicPage() {
  return <p>Topic coming soon.</p>
}
```

Update the Task 1 `App.test.tsx` nav test — it still passes unmodified since the nav links are unchanged.

- [ ] **Step 10: Run the full test suite**

Run: `npm run test`
Expected: PASS (all tests from Tasks 1-5)

- [ ] **Step 11: Commit**

```bash
git add src/pages src/App.tsx
git commit -m "Add Home, section/domain/subsection pages, and full route tree"
```

---

## Task 6: R&W Content — Information and Ideas

**Files:**
- Create: `src/content/readingWriting/informationAndIdeas/centralIdeasDetails.ts`
- Create: `src/content/readingWriting/informationAndIdeas/commandOfEvidence.ts`
- Create: `src/content/readingWriting/informationAndIdeas/inferences.ts`
- Create: `src/content/readingWriting/informationAndIdeas/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` from `src/content/registry.ts` (Task 2); `Lesson`, `Question`, `DomainMeta` types (Task 2).
- Produces: `registerInformationAndIdeas(): DomainMeta`, consumed by `src/content/index.ts` to populate the `reading-writing` section — the pattern every later content task (7-13) repeats for its own domain.

For the lesson `videoId` in this and every later content task: open Khan Academy's official SAT course (khanacademy.org/test-prep/digital-sat) or a well-known free SAT tutor's channel, find the video matching that subsection's topic, and copy its 11-character id from the video's URL (`youtube.com/watch?v=<id>`) into `videoId`.

- [ ] **Step 1: Write the three subsection content files**

```ts
// src/content/readingWriting/informationAndIdeas/centralIdeasDetails.ts
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
```

```ts
// src/content/readingWriting/informationAndIdeas/commandOfEvidence.ts
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
```

```ts
// src/content/readingWriting/informationAndIdeas/inferences.ts
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
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/readingWriting/informationAndIdeas/index.ts
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
```

- [ ] **Step 3: Wire it into `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [registerInformationAndIdeas()],
  },
]
```

- [ ] **Step 4: Run the content validation suite and the full test suite**

Run: `npm run test`
Expected: PASS — `content.test.ts` now exercises real data for the first time (3 subsections × 5 questions) and confirms every `correctAnswer` matches a `choices` entry and every question has hints and a walkthrough.

- [ ] **Step 5: Commit**

```bash
git add src/content/readingWriting/informationAndIdeas src/content/index.ts
git commit -m "Add Information and Ideas lessons and practice questions"
```

---

## Task 7: R&W Content — Craft and Structure

Follows the exact pattern established in Task 6: one content file per subsection, one domain registration module, one addition to `src/content/index.ts`.

**Files:**
- Create: `src/content/readingWriting/craftAndStructure/wordsInContext.ts`
- Create: `src/content/readingWriting/craftAndStructure/textStructurePurpose.ts`
- Create: `src/content/readingWriting/craftAndStructure/crossTextConnections.ts`
- Create: `src/content/readingWriting/craftAndStructure/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` (Task 2); `Lesson`, `Question`, `DomainMeta` types (Task 2).
- Produces: `registerCraftAndStructure(): DomainMeta`, added to the `reading-writing` section's `domains` array.

- [ ] **Step 1: Write the three subsection content files**

```ts
// src/content/readingWriting/craftAndStructure/wordsInContext.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'craft-and-structure',
  subsection: 'words-in-context',
  title: 'Words in Context',
  summary: 'Pick the word or phrase that fits the logic of the sentence, not just a common meaning of the blank.',
  body: "These questions give you a sentence with a blank and ask which word or phrase fits best. The trap is picking a word that sounds sophisticated or is a common synonym rather than the word that actually fits the sentence's internal logic. Look for a signal word — 'although,' 'despite,' 'because,' 'rather than' — that tells you whether the blank should contrast with or reinforce the rest of the sentence.",
  tips: [
    "Cover the answer choices and predict your own word for the blank first, then find the closest match.",
    "Contrast words ('although,' 'however,' 'despite') mean the blank's tone should be opposite the surrounding clause.",
    'Cause words (\'because,\' \'since\') mean the blank should logically follow from the reason given.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'cs-wic-1',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'medium',
    prompt: "Despite the committee's _____ efforts to reach a compromise, the two factions remained unable to agree on even the most basic terms of the proposal. Which choice completes the text with the most logical and precise word?",
    choices: ['halfhearted', 'diligent', 'careless', 'brief'],
    correctAnswer: 'diligent',
    hints: [
      "The word 'despite' signals a contrast between the effort and the outcome.",
      'If a strong effort still failed, the blank should mean genuine, sustained effort.',
    ],
    walkthrough: [
      "'Despite' sets up a contrast between effort and failure.",
      "'Diligent' means careful and persistent, fitting a real effort that still failed.",
      'The other choices would not need "despite" to explain the failure.',
    ],
  },
  {
    id: 'cs-wic-2',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'medium',
    prompt: "The CEO's remarks were intentionally _____, leaving investors uncertain about the company's actual financial outlook. Which choice completes the text with the most logical word?",
    choices: ['vague', 'precise', 'enthusiastic', 'detailed'],
    correctAnswer: 'vague',
    hints: [
      'The result is uncertainty among investors — what kind of language causes that?',
      'Precise or detailed language would reduce uncertainty, not increase it.',
    ],
    walkthrough: [
      'Investors were left uncertain after the remarks.',
      'Vague language explains the resulting uncertainty.',
      'Precise and detailed contradict that outcome.',
    ],
  },
  {
    id: 'cs-wic-3',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'hard',
    prompt: "Although the novel received _____ reviews upon its release, it has since become regarded as a classic of the genre. Which choice completes the text with the most logical word?",
    choices: ['glowing', 'tepid', 'enthusiastic', 'unanimous'],
    correctAnswer: 'tepid',
    hints: [
      "'Although' signals a contrast between initial reception and later reputation.",
      "If reviews were already glowing, there'd be no contrast with the later classic status.",
    ],
    walkthrough: [
      "'Although' sets up a contrast with the later classic status.",
      'Glowing, enthusiastic, or unanimous reviews would not need that contrast.',
      'Tepid (lukewarm) reviews followed by later acclaim creates the needed contrast.',
    ],
  },
  {
    id: 'cs-wic-4',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'hard',
    prompt: "The scientist's hypothesis, once considered _____ by her peers, is now supported by a growing body of evidence. Which choice completes the text with the most logical word?",
    choices: ['conventional', 'implausible', 'obvious', 'popular'],
    correctAnswer: 'implausible',
    hints: [
      "'Once considered X, now supported by evidence' signals a shift from doubt to acceptance.",
      'Conventional, obvious, and popular all describe something already accepted.',
    ],
    walkthrough: [
      'The sentence contrasts a past view with the present.',
      'A hypothesis that now needs support was likely doubted before.',
      "'Implausible' fits; the others contradict needing later support.",
    ],
  },
  {
    id: 'cs-wic-5',
    domain: 'craft-and-structure',
    subsection: 'words-in-context',
    difficulty: 'medium',
    prompt: 'Critics praised the film for its _____ pacing, noting that not a single scene felt rushed or dragged out. Which choice completes the text with the most logical word?',
    choices: ['uneven', 'measured', 'frantic', 'erratic'],
    correctAnswer: 'measured',
    hints: [
      "The clue 'not rushed or dragged out' tells you exactly what quality is being praised.",
      'Look for a word meaning steady and controlled, not inconsistent.',
    ],
    walkthrough: [
      'The clue defines the praised quality as neither rushed nor dragged out.',
      "'Measured' means controlled and steady, matching that description.",
      'Uneven, frantic, and erratic all suggest inconsistency.',
    ],
  },
]
```

```ts
// src/content/readingWriting/craftAndStructure/textStructurePurpose.ts
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
```

```ts
// src/content/readingWriting/craftAndStructure/crossTextConnections.ts
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
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/readingWriting/craftAndStructure/index.ts
import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as wicLesson, questions as wicQuestions } from './wordsInContext'
import { lesson as tspLesson, questions as tspQuestions } from './textStructurePurpose'
import { lesson as ctcLesson, questions as ctcQuestions } from './crossTextConnections'

export function registerCraftAndStructure(): DomainMeta {
  registerContent('craft-and-structure', 'words-in-context', wicLesson, wicQuestions)
  registerContent('craft-and-structure', 'text-structure-purpose', tspLesson, tspQuestions)
  registerContent('craft-and-structure', 'cross-text-connections', ctcLesson, ctcQuestions)
  return {
    slug: 'craft-and-structure',
    title: 'Craft and Structure',
    subsections: [
      { slug: 'words-in-context', title: 'Words in Context' },
      { slug: 'text-structure-purpose', title: 'Text Structure and Purpose' },
      { slug: 'cross-text-connections', title: 'Cross-Text Connections' },
    ],
  }
}
```

- [ ] **Step 3: Add it to `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [registerInformationAndIdeas(), registerCraftAndStructure()],
  },
]
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/readingWriting/craftAndStructure src/content/index.ts
git commit -m "Add Craft and Structure lessons and practice questions"
```

---

## Task 8: R&W Content — Expression of Ideas

Same pattern as Tasks 6-7.

**Files:**
- Create: `src/content/readingWriting/expressionOfIdeas/rhetoricalSynthesis.ts`
- Create: `src/content/readingWriting/expressionOfIdeas/transitions.ts`
- Create: `src/content/readingWriting/expressionOfIdeas/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` (Task 2); `Lesson`, `Question`, `DomainMeta` types (Task 2).
- Produces: `registerExpressionOfIdeas(): DomainMeta`, added to the `reading-writing` section's `domains` array.

- [ ] **Step 1: Write the two subsection content files**

```ts
// src/content/readingWriting/expressionOfIdeas/rhetoricalSynthesis.ts
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
```

```ts
// src/content/readingWriting/expressionOfIdeas/transitions.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'expression-of-ideas',
  subsection: 'transitions',
  title: 'Transitions',
  summary: 'Choose the transition word or phrase that matches the actual logical relationship between two sentences.',
  body: "Transition questions test whether you can identify the precise logical relationship between two sentences: cause-and-effect, contrast, addition, concession, or example. Don't rely on 'sounds right' — work out the relationship first in plain terms ('sentence 2 happens because of sentence 1' or 'sentence 2 is surprising given sentence 1'), then pick the transition that matches that exact relationship.",
  tips: [
    "'However'/'nonetheless'/'nevertheless' signal contrast or an unexpected turn.",
    "'As a result'/'consequently'/'therefore' signal a direct cause-and-effect relationship.",
    "'Additionally'/'furthermore' signal simple addition — the two sentences support the same point without contrast.",
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'eoi-tr-1',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'easy',
    prompt: "The bridge has been closed for repairs since March. ______, commuters have had to take a ten-minute detour every day. Which choice completes the text with the most logical transition?",
    choices: ['For example,', 'As a result,', 'In contrast,', 'Similarly,'],
    correctAnswer: 'As a result,',
    hints: [
      'Look for the logical relationship: cause and effect.',
      'The detour is a consequence of the closure.',
    ],
    walkthrough: [
      'The closure causes the need for a detour.',
      "'As a result' signals a consequence.",
      'The others signal example, contrast, or similarity, which do not fit.',
    ],
  },
  {
    id: 'eoi-tr-2',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'medium',
    prompt: "Many assume that older homes are less energy-efficient than new ones. ______, a recent study found that some older homes, once retrofitted, outperform newly built houses. Which choice completes the text with the most logical transition?",
    choices: ['Similarly,', 'For instance,', 'However,', 'Therefore,'],
    correctAnswer: 'However,',
    hints: [
      'The second sentence challenges the assumption in the first.',
      'Look for a contrast word.',
    ],
    walkthrough: [
      'The first sentence states a common assumption.',
      'The second sentence contradicts it with a study finding.',
      "'However' signals that contrast; the others do not.",
    ],
  },
  {
    id: 'eoi-tr-3',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'medium',
    prompt: "The company reduced its marketing budget by 20% last year. ______, its quarterly sales grew by 10%. Which choice completes the text with the most logical transition?",
    choices: ['Nevertheless,', 'Specifically,', 'As a result,', 'In the same way,'],
    correctAnswer: 'Nevertheless,',
    hints: [
      'Despite a budget cut, sales still grew — that is an unexpected outcome.',
      'Look for a contrast or concession word.',
    ],
    walkthrough: [
      'A budget cut would normally suggest sales might suffer.',
      'Sales grew anyway, which is unexpected.',
      "'Nevertheless' signals this unexpected contrast.",
    ],
  },
  {
    id: 'eoi-tr-4',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'easy',
    prompt: "The new vaccine requires only one dose instead of two. ______, it can be stored at room temperature rather than requiring refrigeration. Which choice completes the text with the most logical transition?",
    choices: ['However,', 'Additionally,', 'Otherwise,', 'Conversely,'],
    correctAnswer: 'Additionally,',
    hints: [
      'Both sentences list separate advantages of the vaccine — are they similar or opposite?',
      'Look for a word that simply adds another point.',
    ],
    walkthrough: [
      'Both sentences describe separate benefits.',
      "'Additionally' adds a second advantage to the first.",
      'The other choices are contrast words, which do not fit here.',
    ],
  },
  {
    id: 'eoi-tr-5',
    domain: 'expression-of-ideas',
    subsection: 'transitions',
    difficulty: 'hard',
    prompt: "Researchers initially believed the chemical was harmless in small doses. ______, further testing revealed it accumulates in soil over time, posing a long-term risk. Which choice completes the text with the most logical transition?",
    choices: ['Likewise,', 'For example,', 'Nonetheless,', 'Consequently,'],
    correctAnswer: 'Nonetheless,',
    hints: [
      'The second sentence reveals something that contradicts the initial belief.',
      'Look for a contrast word signaling new, opposing information.',
    ],
    walkthrough: [
      'The first sentence states an initial, incomplete belief.',
      'The second sentence reveals a contradicting finding from further testing.',
      "'Nonetheless' fits this contrast; the others signal similarity, example, or result.",
    ],
  },
]
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/readingWriting/expressionOfIdeas/index.ts
import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as rsLesson, questions as rsQuestions } from './rhetoricalSynthesis'
import { lesson as trLesson, questions as trQuestions } from './transitions'

export function registerExpressionOfIdeas(): DomainMeta {
  registerContent('expression-of-ideas', 'rhetorical-synthesis', rsLesson, rsQuestions)
  registerContent('expression-of-ideas', 'transitions', trLesson, trQuestions)
  return {
    slug: 'expression-of-ideas',
    title: 'Expression of Ideas',
    subsections: [
      { slug: 'rhetorical-synthesis', title: 'Rhetorical Synthesis' },
      { slug: 'transitions', title: 'Transitions' },
    ],
  }
}
```

- [ ] **Step 3: Add it to `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [registerInformationAndIdeas(), registerCraftAndStructure(), registerExpressionOfIdeas()],
  },
]
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/readingWriting/expressionOfIdeas src/content/index.ts
git commit -m "Add Expression of Ideas lessons and practice questions"
```

---

## Task 9: R&W Content — Standard English Conventions

Same pattern as Tasks 6-8. This domain covers independent/dependent clauses, comma splices, semicolons, and colons (Boundaries), plus subject-verb agreement, pronoun agreement, modifiers, and parallel structure (Form, Structure, and Sense).

**Files:**
- Create: `src/content/readingWriting/standardEnglishConventions/boundaries.ts`
- Create: `src/content/readingWriting/standardEnglishConventions/formStructureSense.ts`
- Create: `src/content/readingWriting/standardEnglishConventions/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` (Task 2); `Lesson`, `Question`, `DomainMeta` types (Task 2).
- Produces: `registerStandardEnglishConventions(): DomainMeta`, added to the `reading-writing` section's `domains` array.

- [ ] **Step 1: Write the two subsection content files**

```ts
// src/content/readingWriting/standardEnglishConventions/boundaries.ts
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
```

```ts
// src/content/readingWriting/standardEnglishConventions/formStructureSense.ts
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
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/readingWriting/standardEnglishConventions/index.ts
import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as bdLesson, questions as bdQuestions } from './boundaries'
import { lesson as fssLesson, questions as fssQuestions } from './formStructureSense'

export function registerStandardEnglishConventions(): DomainMeta {
  registerContent('standard-english-conventions', 'boundaries', bdLesson, bdQuestions)
  registerContent('standard-english-conventions', 'form-structure-sense', fssLesson, fssQuestions)
  return {
    slug: 'standard-english-conventions',
    title: 'Standard English Conventions',
    subsections: [
      { slug: 'boundaries', title: 'Boundaries' },
      { slug: 'form-structure-sense', title: 'Form, Structure, and Sense' },
    ],
  }
}
```

- [ ] **Step 3: Add it to `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'
import { registerStandardEnglishConventions } from './readingWriting/standardEnglishConventions'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [
      registerInformationAndIdeas(),
      registerCraftAndStructure(),
      registerExpressionOfIdeas(),
      registerStandardEnglishConventions(),
    ],
  },
]
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS. The entire Reading & Writing section is now complete and populated.

- [ ] **Step 5: Commit**

```bash
git add src/content/readingWriting/standardEnglishConventions src/content/index.ts
git commit -m "Add Standard English Conventions lessons and practice questions"
```

---

## Task 10: Math Content — Algebra

Same registration pattern as the R&W tasks, now with `desmosConfig` on questions involving graphs, so `Practice` (Task 4) renders a `DesmosCalculator` beside them.

**Files:**
- Create: `src/content/math/algebra/linearEquationsOneVariable.ts`
- Create: `src/content/math/algebra/linearEquationsTwoVariables.ts`
- Create: `src/content/math/algebra/systemsOfEquations.ts`
- Create: `src/content/math/algebra/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` (Task 2); `Lesson`, `Question`, `DomainMeta`, `DesmosConfig` types (Task 2).
- Produces: `registerAlgebra(): DomainMeta`, starting the new `math` section in `src/content/index.ts`.

- [ ] **Step 1: Write the three subsection content files**

```ts
// src/content/math/algebra/linearEquationsOneVariable.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'algebra',
  subsection: 'linear-equations-one-variable',
  title: 'Linear Equations in One Variable',
  summary: 'Isolate the variable by undoing operations in reverse order.',
  body: "To solve a linear equation, first distribute any multiplication across parentheses, then combine like terms on each side, then move all variable terms to one side and all constants to the other, and finally divide to isolate the variable. You can always check your answer by substituting it back into the original equation. You can also verify graphically: move everything to one side so the equation equals zero, graph that expression as y, and find where the graph crosses the x-axis — that x-value is your solution.",
  tips: [
    'Distribute before combining like terms — a common error is combining terms that are still inside parentheses.',
    'Whatever you do to one side of the equation, do the exact same thing to the other side.',
    'Plug your final answer back into the ORIGINAL equation (not a simplified version) to check it.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'alg-leov-1',
    domain: 'algebra',
    subsection: 'linear-equations-one-variable',
    difficulty: 'easy',
    prompt: 'Solve for x: 3(x - 4) = 2x + 5',
    correctAnswer: '17',
    hints: ['Distribute the 3 on the left side first.', 'Collect the x terms on one side and the constants on the other.'],
    walkthrough: ['3x - 12 = 2x + 5', 'Subtract 2x from both sides: x - 12 = 5', 'Add 12 to both sides: x = 17'],
    desmosConfig: { expressions: ['y=3(x-4)-(2x+5)'], bounds: { left: -5, right: 30, top: 20, bottom: -20 } },
  },
  {
    id: 'alg-leov-2',
    domain: 'algebra',
    subsection: 'linear-equations-one-variable',
    difficulty: 'medium',
    prompt: 'Solve for x: (2x + 1) / 3 = x - 2',
    correctAnswer: '7',
    hints: ['Multiply both sides by 3 to clear the fraction.', 'Then move the x terms to one side.'],
    walkthrough: ['Multiply both sides by 3: 2x + 1 = 3x - 6', 'Subtract 2x from both sides: 1 = x - 6', 'Add 6 to both sides: x = 7'],
  },
  {
    id: 'alg-leov-3',
    domain: 'algebra',
    subsection: 'linear-equations-one-variable',
    difficulty: 'easy',
    prompt: 'If 5x - 7 = 2x + 8, what is the value of x?',
    choices: ['3', '5', '7', '15'],
    correctAnswer: '5',
    hints: ['Move all the x terms to one side first.', 'Then isolate x by dividing.'],
    walkthrough: ['Subtract 2x from both sides: 3x - 7 = 8', 'Add 7 to both sides: 3x = 15', 'Divide by 3: x = 5'],
  },
  {
    id: 'alg-leov-4',
    domain: 'algebra',
    subsection: 'linear-equations-one-variable',
    difficulty: 'hard',
    prompt: 'Solve for x: -2(x + 3) = 4(x - 1)',
    correctAnswer: '-1/3',
    hints: ['Distribute on both sides before combining anything.', 'Collect all the x terms on one side.'],
    walkthrough: [
      'Distribute both sides: -2x - 6 = 4x - 4',
      'Add 2x to both sides: -6 = 6x - 4',
      'Add 4 to both sides: -2 = 6x, so x = -2/6 = -1/3',
    ],
    desmosConfig: { expressions: ['y=-2(x+3)-4(x-1)'], bounds: { left: -5, right: 5, top: 20, bottom: -20 } },
  },
  {
    id: 'alg-leov-5',
    domain: 'algebra',
    subsection: 'linear-equations-one-variable',
    difficulty: 'medium',
    prompt: 'If (x + 3) / 4 = (x - 1) / 2, what is the value of x?',
    choices: ['3', '5', '7', '9'],
    correctAnswer: '5',
    hints: ['Cross-multiply to clear both fractions at once.', 'Then distribute and collect like terms.'],
    walkthrough: ['Cross-multiply: 2(x + 3) = 4(x - 1)', 'Distribute: 2x + 6 = 4x - 4', 'Solve: 10 = 2x, so x = 5'],
  },
]
```

```ts
// src/content/math/algebra/linearEquationsTwoVariables.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'algebra',
  subsection: 'linear-equations-two-variables',
  title: 'Linear Equations in Two Variables and Their Graphs',
  summary: 'Every linear equation y = mx + b describes a straight line with slope m and y-intercept b.',
  body: "The slope-intercept form y = mx + b tells you everything about a line's graph: m is the slope (rise over run between any two points), and b is the y-intercept (the point where the line crosses the x = 0 axis). To find the slope between two points, divide the change in y by the change in x. To find where a line crosses the x-axis (the x-intercept), set y = 0 and solve for x. Desmos is especially useful here: graph the equation directly and read the intercepts off the graph to check your algebra.",
  tips: [
    'Slope = (y2 - y1) / (x2 - x1) — always subtract in the same order in both the numerator and denominator.',
    'To find a y-intercept, set x = 0. To find an x-intercept, set y = 0.',
    'If a point satisfies an equation, plugging its x and y values into the equation makes both sides equal.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'alg-letv-1',
    domain: 'algebra',
    subsection: 'linear-equations-two-variables',
    difficulty: 'medium',
    prompt: 'A line passes through the points (2, 5) and (4, 9). What is the y-intercept of this line?',
    correctAnswer: '1',
    hints: ['Find the slope first using both points.', 'Then use one point and the slope to solve for b in y = mx + b.'],
    walkthrough: [
      'Slope = (9 - 5) / (4 - 2) = 4 / 2 = 2',
      'Using point (2, 5): 5 = 2(2) + b, so 5 = 4 + b',
      'b = 1, so the y-intercept is 1',
    ],
    desmosConfig: { expressions: ['y=2x+1', '(2,5)', '(4,9)'] },
  },
  {
    id: 'alg-letv-2',
    domain: 'algebra',
    subsection: 'linear-equations-two-variables',
    difficulty: 'easy',
    prompt: 'Which point lies on the line y = -3x + 7?',
    choices: ['(2, 1)', '(1, 3)', '(3, -1)', '(0, -7)'],
    correctAnswer: '(2, 1)',
    hints: ['Plug each point\'s x-value into the equation and check if it produces the matching y-value.', 'Start with x = 2: y = -3(2) + 7.'],
    walkthrough: ['Test (2, 1): y = -3(2) + 7 = -6 + 7 = 1, which matches.', 'The other points do not satisfy the equation when checked the same way.'],
    desmosConfig: { expressions: ['y=-3x+7'] },
  },
  {
    id: 'alg-letv-3',
    domain: 'algebra',
    subsection: 'linear-equations-two-variables',
    difficulty: 'medium',
    prompt: 'A line has a slope of 1/2 and passes through (0, -3). At what x-value does this line cross the x-axis?',
    correctAnswer: '6',
    hints: ['Write the equation in slope-intercept form first.', 'The x-axis is where y = 0.'],
    walkthrough: ['The equation is y = (1/2)x - 3', 'Set y = 0: 0 = (1/2)x - 3', 'Solve: (1/2)x = 3, so x = 6'],
    desmosConfig: { expressions: ['y=0.5x-3'] },
  },
  {
    id: 'alg-letv-4',
    domain: 'algebra',
    subsection: 'linear-equations-two-variables',
    difficulty: 'medium',
    prompt: 'Given the line y = 4x - 9, what is its x-intercept?',
    correctAnswer: '9/4',
    hints: ['The x-intercept is where y = 0.', 'Substitute y = 0 and solve for x.'],
    walkthrough: ['Set y = 0: 0 = 4x - 9', 'Add 9 to both sides: 4x = 9', 'Divide by 4: x = 9/4'],
    desmosConfig: { expressions: ['y=4x-9'] },
  },
  {
    id: 'alg-letv-5',
    domain: 'algebra',
    subsection: 'linear-equations-two-variables',
    difficulty: 'hard',
    prompt: 'The lines y = 2x + 3 and y = -x + 9 intersect at one point. What is the y-value at that point?',
    correctAnswer: '7',
    hints: ['At the intersection, both equations have the same x and y values.', 'Set the two right-hand sides equal to each other and solve for x first.'],
    walkthrough: [
      'Set 2x + 3 = -x + 9',
      'Add x to both sides: 3x + 3 = 9, so 3x = 6, giving x = 2',
      'Substitute into either equation: y = 2(2) + 3 = 7',
    ],
    desmosConfig: { expressions: ['y=2x+3', 'y=-x+9'] },
  },
]
```

```ts
// src/content/math/algebra/systemsOfEquations.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'algebra',
  subsection: 'systems-of-equations',
  title: 'Systems of Linear Equations',
  summary: 'Solve two equations with two unknowns using substitution, elimination, or a graph.',
  body: "A system of two linear equations has one solution where the two lines intersect, unless the lines are parallel (no solution) or identical (infinitely many solutions). To solve algebraically, use substitution (solve one equation for a variable and plug it into the other) or elimination (add or subtract the equations to cancel a variable). On Desmos, you can just graph both lines and read the intersection point directly, or use the table feature to test answer choices quickly.",
  tips: [
    'Elimination works best when the coefficients of one variable are already the same or opposite in both equations.',
    'Two lines have no solution when they have the same slope but different y-intercepts (parallel).',
    'Two equations have infinitely many solutions when they are the same line written differently (same slope AND same y-intercept).',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'alg-soe-1',
    domain: 'algebra',
    subsection: 'systems-of-equations',
    difficulty: 'medium',
    prompt: 'If x + y = 10 and x - y = 2, what is the value of x * y?',
    correctAnswer: '24',
    hints: ['Add the two equations together to eliminate y.', 'Once you have x, substitute back to find y.'],
    walkthrough: ['Add the equations: 2x = 12, so x = 6', 'Substitute into x + y = 10: y = 4', 'x * y = 6 * 4 = 24'],
    desmosConfig: { expressions: ['x+y=10', 'x-y=2'] },
  },
  {
    id: 'alg-soe-2',
    domain: 'algebra',
    subsection: 'systems-of-equations',
    difficulty: 'easy',
    prompt: 'If 2x + 3y = 12 and x = 3, what is the value of x + y?',
    correctAnswer: '5',
    hints: ['Substitute x = 3 directly into the first equation.', 'Solve for y, then add x and y.'],
    walkthrough: ['Substitute: 2(3) + 3y = 12, so 6 + 3y = 12', 'Subtract 6: 3y = 6, so y = 2', 'x + y = 3 + 2 = 5'],
  },
  {
    id: 'alg-soe-3',
    domain: 'algebra',
    subsection: 'systems-of-equations',
    difficulty: 'medium',
    prompt: 'If 3x - 2y = 4 and x + 2y = 12, what is the value of x - y?',
    correctAnswer: '0',
    hints: ['Add the two equations to eliminate y.', 'Then substitute back to find y and compute x - y.'],
    walkthrough: ['Add the equations: 4x = 16, so x = 4', 'Substitute into x + 2y = 12: 4 + 2y = 12, so y = 4', 'x - y = 4 - 4 = 0'],
    desmosConfig: { expressions: ['3x-2y=4', 'x+2y=12'] },
  },
  {
    id: 'alg-soe-4',
    domain: 'algebra',
    subsection: 'systems-of-equations',
    difficulty: 'medium',
    prompt: 'If 4x + y = 11 and y = 2x - 1, what is the value of x + y?',
    correctAnswer: '5',
    hints: ['Substitute the expression for y directly into the first equation.', 'Solve for x first, then find y.'],
    walkthrough: ['Substitute: 4x + (2x - 1) = 11, so 6x - 1 = 11', 'Add 1: 6x = 12, so x = 2', 'y = 2(2) - 1 = 3, so x + y = 5'],
  },
  {
    id: 'alg-soe-5',
    domain: 'algebra',
    subsection: 'systems-of-equations',
    difficulty: 'hard',
    prompt: 'The system y = 2x + 5 and y = 2x + k has infinitely many solutions. What is the value of k?',
    choices: ['-5', '0', '2', '5'],
    correctAnswer: '5',
    hints: ['Infinitely many solutions means the two equations describe the exact same line.', 'Compare the y-intercepts of both lines.'],
    walkthrough: [
      'Both lines already have the same slope, 2.',
      'For infinitely many solutions, the lines must be identical, so the y-intercepts must match too.',
      'k must equal 5 to match the first equation\'s y-intercept.',
    ],
  },
]
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/math/algebra/index.ts
import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as leovLesson, questions as leovQuestions } from './linearEquationsOneVariable'
import { lesson as letvLesson, questions as letvQuestions } from './linearEquationsTwoVariables'
import { lesson as soeLesson, questions as soeQuestions } from './systemsOfEquations'

export function registerAlgebra(): DomainMeta {
  registerContent('algebra', 'linear-equations-one-variable', leovLesson, leovQuestions)
  registerContent('algebra', 'linear-equations-two-variables', letvLesson, letvQuestions)
  registerContent('algebra', 'systems-of-equations', soeLesson, soeQuestions)
  return {
    slug: 'algebra',
    title: 'Algebra',
    subsections: [
      { slug: 'linear-equations-one-variable', title: 'Linear Equations in One Variable' },
      { slug: 'linear-equations-two-variables', title: 'Linear Equations in Two Variables' },
      { slug: 'systems-of-equations', title: 'Systems of Equations' },
    ],
  }
}
```

- [ ] **Step 3: Add the `math` section to `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'
import { registerStandardEnglishConventions } from './readingWriting/standardEnglishConventions'
import { registerAlgebra } from './math/algebra'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [
      registerInformationAndIdeas(),
      registerCraftAndStructure(),
      registerExpressionOfIdeas(),
      registerStandardEnglishConventions(),
    ],
  },
  {
    slug: 'math',
    title: 'Math',
    domains: [registerAlgebra()],
  },
]
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/math/algebra src/content/index.ts
git commit -m "Add Algebra lessons and practice questions with Desmos graphs"
```

---

## Task 11: Math Content — Advanced Math

Same pattern as Task 10.

**Files:**
- Create: `src/content/math/advancedMath/nonlinearEquationsFunctions.ts`
- Create: `src/content/math/advancedMath/equivalentExpressions.ts`
- Create: `src/content/math/advancedMath/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` (Task 2); `Lesson`, `Question`, `DomainMeta` types (Task 2).
- Produces: `registerAdvancedMath(): DomainMeta`, added to the `math` section's `domains` array.

- [ ] **Step 1: Write the two subsection content files**

```ts
// src/content/math/advancedMath/nonlinearEquationsFunctions.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'advanced-math',
  subsection: 'nonlinear-equations-functions',
  title: 'Nonlinear Equations and Functions',
  summary: 'Solve quadratics by factoring or the quadratic formula, and evaluate functions at given inputs.',
  body: "A quadratic equation ax^2 + bx + c = 0 can often be solved by factoring into two binomials, or always by the quadratic formula x = (-b ± sqrt(b^2 - 4ac)) / 2a. The vertex of a parabola y = ax^2 + bx + c is at x = -b / 2a; plug that x back in to find the vertex's y-coordinate. To evaluate a function f(x) at a specific input, substitute that number everywhere x appears and simplify. Graphing the equation on Desmos lets you check your solutions visually — the solutions to ax^2+bx+c=0 are exactly where the parabola crosses the x-axis.",
  tips: [
    'Before using the quadratic formula, check if the expression factors easily — it is usually faster.',
    'The discriminant b^2 - 4ac tells you how many real solutions exist: positive means two, zero means one, negative means none.',
    'f(5) means "substitute 5 for every x" — do not confuse it with multiplying f by 5.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'am-nef-1',
    domain: 'advanced-math',
    subsection: 'nonlinear-equations-functions',
    difficulty: 'medium',
    prompt: 'The equation x^2 - 5x + 6 = 0 has two solutions. What is their sum?',
    correctAnswer: '5',
    hints: ['Try factoring the quadratic first.', 'Once you have both solutions, add them together.'],
    walkthrough: ['Factor: (x - 2)(x - 3) = 0', 'The solutions are x = 2 and x = 3', 'Their sum is 2 + 3 = 5'],
    desmosConfig: { expressions: ['y=x^2-5x+6'], bounds: { left: -5, right: 10, top: 10, bottom: -10 } },
  },
  {
    id: 'am-nef-2',
    domain: 'advanced-math',
    subsection: 'nonlinear-equations-functions',
    difficulty: 'easy',
    prompt: 'What is the positive solution to x^2 - 9 = 0?',
    correctAnswer: '3',
    hints: ['Add 9 to both sides first.', 'Remember a square root has both a positive and negative solution.'],
    walkthrough: ['x^2 = 9', 'x = 3 or x = -3', 'The positive solution is 3'],
    desmosConfig: { expressions: ['y=x^2-9'] },
  },
  {
    id: 'am-nef-3',
    domain: 'advanced-math',
    subsection: 'nonlinear-equations-functions',
    difficulty: 'medium',
    prompt: 'If f(x) = x^2 - 4x + 3, what is f(5)?',
    correctAnswer: '8',
    hints: ['Substitute 5 for every x in the expression.', 'Follow order of operations: exponent first, then multiplication, then subtraction.'],
    walkthrough: ['f(5) = (5)^2 - 4(5) + 3', '= 25 - 20 + 3', '= 8'],
  },
  {
    id: 'am-nef-4',
    domain: 'advanced-math',
    subsection: 'nonlinear-equations-functions',
    difficulty: 'hard',
    prompt: 'What is the greater of the two solutions to 2x^2 + 3x - 2 = 0?',
    correctAnswer: '1/2',
    hints: ['Try the quadratic formula with a = 2, b = 3, c = -2.', 'The discriminant is b^2 - 4ac.'],
    walkthrough: [
      'Discriminant: 3^2 - 4(2)(-2) = 9 + 16 = 25',
      'x = (-3 ± sqrt(25)) / (2 * 2) = (-3 ± 5) / 4',
      'The two solutions are 1/2 and -2; the greater one is 1/2',
    ],
    desmosConfig: { expressions: ['y=2x^2+3x-2'], bounds: { left: -5, right: 5, top: 10, bottom: -10 } },
  },
  {
    id: 'am-nef-5',
    domain: 'advanced-math',
    subsection: 'nonlinear-equations-functions',
    difficulty: 'hard',
    prompt: 'What is the y-coordinate of the vertex of y = x^2 - 6x + 5?',
    correctAnswer: '-4',
    hints: ['Find the x-coordinate of the vertex first using x = -b / 2a.', 'Then substitute that x back into the equation to find y.'],
    walkthrough: ['x = -(-6) / (2 * 1) = 3', 'y = (3)^2 - 6(3) + 5 = 9 - 18 + 5 = -4', 'The vertex is at (3, -4)'],
    desmosConfig: { expressions: ['y=x^2-6x+5'] },
  },
]
```

```ts
// src/content/math/advancedMath/equivalentExpressions.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'advanced-math',
  subsection: 'equivalent-expressions',
  title: 'Equivalent Expressions',
  summary: 'Simplify, expand, and factor expressions while keeping them mathematically equivalent.',
  body: "These questions ask you to rewrite an expression in an equivalent form: expanding a product of binomials with FOIL (First, Outer, Inner, Last), factoring a quadratic by finding two numbers that multiply to c and add to b, simplifying a rational expression by canceling common factors, or combining like terms after distributing. Always double-check your simplified expression by plugging in a simple number (like x = 2) into both the original and your simplified version — they must give the same result.",
  tips: [
    'FOIL for (a + b)(c + d) gives ac + ad + bc + bd.',
    'To factor x^2 + bx + c, find two numbers that multiply to c and add to b.',
    'Verify any simplification by substituting a test number into both the original and simplified expressions.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'am-ee-1',
    domain: 'advanced-math',
    subsection: 'equivalent-expressions',
    difficulty: 'medium',
    prompt: 'For x ≠ 3, which expression is equivalent to (x^2 - 9) / (x - 3)?',
    choices: ['x + 3', 'x - 3', 'x + 9', 'x - 9'],
    correctAnswer: 'x + 3',
    hints: ['Factor the numerator as a difference of squares first.', 'Then cancel the common factor with the denominator.'],
    walkthrough: ['x^2 - 9 factors to (x - 3)(x + 3)', 'Divide by (x - 3): (x - 3)(x + 3) / (x - 3) = x + 3', 'The (x - 3) factors cancel, leaving x + 3'],
  },
  {
    id: 'am-ee-2',
    domain: 'advanced-math',
    subsection: 'equivalent-expressions',
    difficulty: 'easy',
    prompt: 'Which expression is equivalent to (x + 2)(x - 5)?',
    choices: ['x^2 - 3x - 10', 'x^2 + 3x - 10', 'x^2 - 10', 'x^2 - 7x - 10'],
    correctAnswer: 'x^2 - 3x - 10',
    hints: ['Use FOIL: First, Outer, Inner, Last.', 'Combine the two middle (Outer and Inner) terms.'],
    walkthrough: ['First: x * x = x^2', 'Outer + Inner: -5x + 2x = -3x', 'Last: 2 * -5 = -10, giving x^2 - 3x - 10'],
  },
  {
    id: 'am-ee-3',
    domain: 'advanced-math',
    subsection: 'equivalent-expressions',
    difficulty: 'medium',
    prompt: 'Which expression is equivalent to x^2 + 7x + 12?',
    choices: ['(x + 3)(x + 4)', '(x + 2)(x + 6)', '(x + 1)(x + 12)', '(x - 3)(x - 4)'],
    correctAnswer: '(x + 3)(x + 4)',
    hints: ['Find two numbers that multiply to 12 and add to 7.', 'Check 3 and 4.'],
    walkthrough: ['3 * 4 = 12 and 3 + 4 = 7', 'So x^2 + 7x + 12 factors as (x + 3)(x + 4)', 'Expanding confirms this matches the original expression'],
  },
  {
    id: 'am-ee-4',
    domain: 'advanced-math',
    subsection: 'equivalent-expressions',
    difficulty: 'medium',
    prompt: 'Which expression is equivalent to (3x^2y)(2xy^3)?',
    choices: ['6x^3y^4', '6x^2y^3', '5x^3y^4', '6x^3y^3'],
    correctAnswer: '6x^3y^4',
    hints: ['Multiply the coefficients together separately from the variables.', 'When multiplying powers of the same base, add the exponents.'],
    walkthrough: ['Coefficients: 3 * 2 = 6', 'x powers: x^2 * x^1 = x^3', 'y powers: y^1 * y^3 = y^4, giving 6x^3y^4'],
  },
  {
    id: 'am-ee-5',
    domain: 'advanced-math',
    subsection: 'equivalent-expressions',
    difficulty: 'easy',
    prompt: 'Which expression is equivalent to 2(x + 3) + 4(x - 1)?',
    choices: ['6x + 2', '6x + 10', '2x + 2', '6x - 2'],
    correctAnswer: '6x + 2',
    hints: ['Distribute each term first.', 'Then combine like terms.'],
    walkthrough: ['Distribute: 2x + 6 + 4x - 4', 'Combine x terms: 2x + 4x = 6x', 'Combine constants: 6 - 4 = 2, giving 6x + 2'],
  },
]
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/math/advancedMath/index.ts
import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as nefLesson, questions as nefQuestions } from './nonlinearEquationsFunctions'
import { lesson as eeLesson, questions as eeQuestions } from './equivalentExpressions'

export function registerAdvancedMath(): DomainMeta {
  registerContent('advanced-math', 'nonlinear-equations-functions', nefLesson, nefQuestions)
  registerContent('advanced-math', 'equivalent-expressions', eeLesson, eeQuestions)
  return {
    slug: 'advanced-math',
    title: 'Advanced Math',
    subsections: [
      { slug: 'nonlinear-equations-functions', title: 'Nonlinear Equations and Functions' },
      { slug: 'equivalent-expressions', title: 'Equivalent Expressions' },
    ],
  }
}
```

- [ ] **Step 3: Add it to `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'
import { registerStandardEnglishConventions } from './readingWriting/standardEnglishConventions'
import { registerAlgebra } from './math/algebra'
import { registerAdvancedMath } from './math/advancedMath'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [
      registerInformationAndIdeas(),
      registerCraftAndStructure(),
      registerExpressionOfIdeas(),
      registerStandardEnglishConventions(),
    ],
  },
  {
    slug: 'math',
    title: 'Math',
    domains: [registerAlgebra(), registerAdvancedMath()],
  },
]
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/math/advancedMath src/content/index.ts
git commit -m "Add Advanced Math lessons and practice questions with Desmos graphs"
```

---

## Task 12: Math Content — Problem-Solving and Data Analysis

Same pattern as Tasks 10-11. No Desmos configs here — these questions are arithmetic/data reasoning, not graph-based, matching the Review Focus rule that `DesmosCalculator` only renders when `desmosConfig` is present.

**Files:**
- Create: `src/content/math/problemSolvingDataAnalysis/ratiosRatesProportions.ts`
- Create: `src/content/math/problemSolvingDataAnalysis/percentages.ts`
- Create: `src/content/math/problemSolvingDataAnalysis/dataAndProbability.ts`
- Create: `src/content/math/problemSolvingDataAnalysis/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` (Task 2); `Lesson`, `Question`, `DomainMeta` types (Task 2).
- Produces: `registerProblemSolvingDataAnalysis(): DomainMeta`, added to the `math` section's `domains` array.

- [ ] **Step 1: Write the three subsection content files**

```ts
// src/content/math/problemSolvingDataAnalysis/ratiosRatesProportions.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'problem-solving-data-analysis',
  subsection: 'ratios-rates-proportions',
  title: 'Ratios, Rates, and Proportions',
  summary: 'Set up a proportion by keeping matching units in the same position on both sides.',
  body: "A ratio compares two quantities; a rate compares two quantities with different units (like miles and hours). To solve a proportion problem, write both ratios as fractions with the same units in the same position (e.g., flour over sugar on both sides), then cross-multiply to solve for the unknown. For rate problems, find the unit rate first (the amount per single unit of the other quantity), then multiply by however many units you need. For work problems (multiple people/machines working together), the combined rate is the sum of the individual rates.",
  tips: [
    'Always label your units when setting up a ratio — it helps catch a flipped fraction.',
    'Unit rate = total amount ÷ total time (or whatever the second quantity is).',
    'If one worker takes T hours alone, their rate is 1/T of the job per hour; add rates together for multiple workers.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'psda-rrp-1',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'easy',
    prompt: 'A recipe uses flour and sugar in a ratio of 2:3. If the recipe calls for 10 cups of flour, how many cups of sugar are needed?',
    correctAnswer: '15',
    hints: ['Set up a proportion: 2/3 = 10/x.', 'Cross-multiply to solve for x.'],
    walkthrough: ['2/3 = 10/x', 'Cross-multiply: 2x = 30', 'x = 15 cups of sugar'],
  },
  {
    id: 'psda-rrp-2',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'medium',
    prompt: 'A car travels 240 miles in 3 hours at a constant rate. At that same rate, how far will it travel in 5 hours?',
    correctAnswer: '400',
    hints: ['Find the unit rate: miles per hour.', 'Multiply the unit rate by 5 hours.'],
    walkthrough: ['Rate: 240 / 3 = 80 miles per hour', 'Distance in 5 hours: 80 * 5 = 400 miles'],
  },
  {
    id: 'psda-rrp-3',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'medium',
    prompt: 'On a map, 1 inch represents 25 miles. If two cities are 3.5 inches apart on the map, what is the actual distance between them, in miles?',
    correctAnswer: '87.5',
    hints: ['Set up a proportion: 1 inch / 25 miles = 3.5 inches / x miles.', 'Cross-multiply, or just multiply 3.5 by 25 directly since the scale is per inch.'],
    walkthrough: ['Since 1 inch = 25 miles, multiply: 3.5 * 25 = 87.5', 'The actual distance is 87.5 miles'],
  },
  {
    id: 'psda-rrp-4',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'easy',
    prompt: 'If a:b = 3:5 and b = 20, what is the value of a?',
    correctAnswer: '12',
    hints: ['Set up the proportion a/b = 3/5 using the given value of b.', 'Cross-multiply to solve for a.'],
    walkthrough: ['a/20 = 3/5', 'Cross-multiply: 5a = 60', 'a = 12'],
  },
  {
    id: 'psda-rrp-5',
    domain: 'problem-solving-data-analysis',
    subsection: 'ratios-rates-proportions',
    difficulty: 'hard',
    prompt: 'One person can paint a room in 8 hours. If a second person works at the same rate alongside the first, how many hours will it take them to paint the room together?',
    correctAnswer: '4',
    hints: ['Each person paints 1/8 of the room per hour.', 'Add their rates together to find the combined rate, then find the time.'],
    walkthrough: ['Combined rate: 1/8 + 1/8 = 2/8 = 1/4 of the room per hour', 'Time = 1 job / (1/4 per hour) = 4 hours'],
  },
]
```

```ts
// src/content/math/problemSolvingDataAnalysis/percentages.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'problem-solving-data-analysis',
  subsection: 'percentages',
  title: 'Percentages',
  summary: 'Convert percentages to decimals and set up the right equation for increase, decrease, or percent-of.',
  body: "'X% of Y' means multiply Y by X/100. A percent increase means multiply the original value by (1 + rate); a percent decrease means multiply by (1 - rate). To find what percent one number is of another, divide the part by the whole and multiply by 100. To work backward from a final price after a percent change, divide by (1 ± rate) instead of multiplying.",
  tips: [
    "A 25% increase means multiply by 1.25; a 15% decrease means multiply by 0.85.",
    "To reverse a percent change and find the original value, divide the final value by (1 ± rate), don't just apply the opposite percent.",
    'Percent change = (new - old) / old * 100.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'psda-pct-1',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'easy',
    prompt: 'What is 20% of 150?',
    correctAnswer: '30',
    hints: ['Convert 20% to a decimal: 0.20.', 'Multiply 0.20 by 150.'],
    walkthrough: ['20% = 0.20', '0.20 * 150 = 30'],
  },
  {
    id: 'psda-pct-2',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'easy',
    prompt: 'A jacket originally priced at $80 is increased by 25%. What is the new price, in dollars?',
    correctAnswer: '100',
    hints: ['A 25% increase means multiply the original price by 1.25.', '0.25 * 80 is the amount added to the original price.'],
    walkthrough: ['25% of 80 = 0.25 * 80 = 20', 'New price = 80 + 20 = 100'],
  },
  {
    id: 'psda-pct-3',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'medium',
    prompt: '45 is what percent of 180? (Enter your answer as a number, without a percent sign.)',
    correctAnswer: '25',
    hints: ['Divide the part by the whole.', 'Multiply the result by 100 to express it as a percent.'],
    walkthrough: ['45 / 180 = 0.25', '0.25 * 100 = 25%'],
  },
  {
    id: 'psda-pct-4',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'medium',
    prompt: 'A town\'s population grew from 200 to 250. What is the percent increase? (Enter your answer as a number, without a percent sign.)',
    correctAnswer: '25',
    hints: ['Percent change = (new - old) / old * 100.', 'The increase amount is 250 - 200 = 50.'],
    walkthrough: ['Change: 250 - 200 = 50', 'Percent increase: 50 / 200 * 100 = 25%'],
  },
  {
    id: 'psda-pct-5',
    domain: 'problem-solving-data-analysis',
    subsection: 'percentages',
    difficulty: 'hard',
    prompt: 'After a 15% discount, a jacket costs $68. What was the original price, in dollars?',
    correctAnswer: '80',
    hints: ['A 15% discount means the final price is 85% of the original.', 'Divide the final price by 0.85, rather than adding 15% back to $68.'],
    walkthrough: ['Final price = original * 0.85', '68 = original * 0.85', 'original = 68 / 0.85 = 80'],
  },
]
```

```ts
// src/content/math/problemSolvingDataAnalysis/dataAndProbability.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'problem-solving-data-analysis',
  subsection: 'data-and-probability',
  title: 'One- and Two-Variable Data, and Probability',
  summary: 'Compute mean, median, and probability, and compare how spread out different data sets are.',
  body: "The mean is the sum of all values divided by how many there are. The median is the middle value when the data is sorted (average the two middle values if there's an even count). Standard deviation measures how spread out the data is around the mean — a data set with values far from the mean has a higher standard deviation than one where values are clustered close to the mean, even if both have the same mean. Probability of an event = (number of favorable outcomes) / (total number of outcomes). For two-way tables, probability of both conditions = count satisfying both / total count.",
  tips: [
    'Sort the data before finding the median — order matters.',
    'Two data sets can share the same mean but have very different standard deviations if one is more spread out.',
    'For "and" probability questions using a table, always divide by the grand total, not a subgroup total, unless the question specifies a condition.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'psda-dap-1',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'easy',
    prompt: 'What is the mean of the data set: 4, 8, 6, 10, 12?',
    correctAnswer: '8',
    hints: ['Add all the values together first.', 'Divide the sum by the number of values.'],
    walkthrough: ['Sum: 4 + 8 + 6 + 10 + 12 = 40', 'Mean: 40 / 5 = 8'],
  },
  {
    id: 'psda-dap-2',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'easy',
    prompt: 'What is the median of the data set: 3, 7, 9, 2, 5?',
    correctAnswer: '5',
    hints: ['Sort the data from least to greatest first.', 'The median is the middle value of the sorted list.'],
    walkthrough: ['Sorted: 2, 3, 5, 7, 9', 'The middle value is 5'],
  },
  {
    id: 'psda-dap-3',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'medium',
    prompt: 'A bag contains 4 red marbles and 6 blue marbles. If one marble is drawn at random, what is the probability it is red? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '2/5',
    hints: ['Probability = favorable outcomes / total outcomes.', 'There are 10 marbles total.'],
    walkthrough: ['Total marbles: 4 + 6 = 10', 'P(red) = 4 / 10 = 2/5'],
  },
  {
    id: 'psda-dap-4',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'medium',
    prompt: "Data set A: 10, 10, 10, 10, 10. Data set B: 2, 6, 10, 14, 18. Both sets have a mean of 10. Which data set has the greater standard deviation?",
    choices: ['Data set A', 'Data set B', 'They are equal', 'Cannot be determined'],
    correctAnswer: 'Data set B',
    hints: ['Standard deviation measures how far values are spread from the mean.', 'Compare how far each value in each set is from 10.'],
    walkthrough: [
      'Every value in Set A equals the mean, so its spread (standard deviation) is 0.',
      'Set B has values ranging from 2 to 18, far from the mean of 10.',
      'Set B has the greater standard deviation.',
    ],
  },
  {
    id: 'psda-dap-5',
    domain: 'problem-solving-data-analysis',
    subsection: 'data-and-probability',
    difficulty: 'hard',
    prompt: 'Of 50 students, 30 play a sport, and 10 of those 30 also play a musical instrument. If a student is chosen at random from all 50, what is the probability that the student plays both a sport and an instrument? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '1/5',
    hints: ['Find how many students satisfy both conditions (play both).', 'Divide that count by the total number of students, 50 — not by 30.'],
    walkthrough: ['Students who play both: 10', 'P(both) = 10 / 50 = 1/5'],
  },
]
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/math/problemSolvingDataAnalysis/index.ts
import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as rrpLesson, questions as rrpQuestions } from './ratiosRatesProportions'
import { lesson as pctLesson, questions as pctQuestions } from './percentages'
import { lesson as dapLesson, questions as dapQuestions } from './dataAndProbability'

export function registerProblemSolvingDataAnalysis(): DomainMeta {
  registerContent('problem-solving-data-analysis', 'ratios-rates-proportions', rrpLesson, rrpQuestions)
  registerContent('problem-solving-data-analysis', 'percentages', pctLesson, pctQuestions)
  registerContent('problem-solving-data-analysis', 'data-and-probability', dapLesson, dapQuestions)
  return {
    slug: 'problem-solving-data-analysis',
    title: 'Problem-Solving and Data Analysis',
    subsections: [
      { slug: 'ratios-rates-proportions', title: 'Ratios, Rates, and Proportions' },
      { slug: 'percentages', title: 'Percentages' },
      { slug: 'data-and-probability', title: 'Data and Probability' },
    ],
  }
}
```

- [ ] **Step 3: Add it to `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'
import { registerStandardEnglishConventions } from './readingWriting/standardEnglishConventions'
import { registerAlgebra } from './math/algebra'
import { registerAdvancedMath } from './math/advancedMath'
import { registerProblemSolvingDataAnalysis } from './math/problemSolvingDataAnalysis'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [
      registerInformationAndIdeas(),
      registerCraftAndStructure(),
      registerExpressionOfIdeas(),
      registerStandardEnglishConventions(),
    ],
  },
  {
    slug: 'math',
    title: 'Math',
    domains: [registerAlgebra(), registerAdvancedMath(), registerProblemSolvingDataAnalysis()],
  },
]
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/math/problemSolvingDataAnalysis src/content/index.ts
git commit -m "Add Problem-Solving and Data Analysis lessons and practice questions"
```

---

## Task 13: Math Content — Geometry and Trigonometry

Same pattern as Tasks 10-12. This is the last math domain, completing the `math` section.

**Files:**
- Create: `src/content/math/geometryAndTrigonometry/areaAndVolume.ts`
- Create: `src/content/math/geometryAndTrigonometry/linesAnglesTriangles.ts`
- Create: `src/content/math/geometryAndTrigonometry/rightTriangleTrigCircles.ts`
- Create: `src/content/math/geometryAndTrigonometry/index.ts`
- Modify: `src/content/index.ts`

**Interfaces:**
- Consumes: `registerContent` (Task 2); `Lesson`, `Question`, `DomainMeta` types (Task 2).
- Produces: `registerGeometryAndTrigonometry(): DomainMeta`, added to the `math` section's `domains` array.

- [ ] **Step 1: Write the three subsection content files**

```ts
// src/content/math/geometryAndTrigonometry/areaAndVolume.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'geometry-and-trigonometry',
  subsection: 'area-and-volume',
  title: 'Area and Volume',
  summary: 'Apply the standard area and volume formulas for common shapes.',
  body: "Memorize the core formulas: rectangle area = length × width; triangle area = (1/2) × base × height; circle area = πr^2; cylinder volume = πr^2 × height; cube volume = side^3. When a question gives you a figure made of combined shapes, split it into the simple shapes you know, compute each area or volume separately, then add or subtract as needed. When an answer involves π, leave it in terms of π (e.g., '9pi') unless the question asks for a decimal approximation.",
  tips: [
    'Draw or sketch the figure if one is not given — visualizing the shape prevents formula mix-ups.',
    'For composite figures, break them into rectangles, triangles, and circles you can calculate individually.',
    "Keep track of whether a question wants area (square units) or volume (cubic units) — the units tell you which formula to use.",
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'gt-av-1',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A rectangle has a length of 8 and a width of 5. What is its area?',
    correctAnswer: '40',
    hints: ['Area of a rectangle = length × width.', 'Multiply 8 by 5.'],
    walkthrough: ['Area = length × width', 'Area = 8 × 5 = 40'],
  },
  {
    id: 'gt-av-2',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A circle has a radius of 3. What is its area, in terms of π? (Enter like "9pi".)',
    correctAnswer: '9pi',
    hints: ['Area of a circle = πr^2.', 'Square the radius first, then attach π.'],
    walkthrough: ['Area = πr^2', 'Area = π(3)^2 = 9π'],
    desmosConfig: { expressions: ['(x)^2+(y)^2=9'], bounds: { left: -6, right: 6, top: 6, bottom: -6 } },
  },
  {
    id: 'gt-av-3',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'medium',
    prompt: 'A cylinder has a radius of 2 and a height of 5. What is its volume, in terms of π? (Enter like "20pi".)',
    correctAnswer: '20pi',
    hints: ['Volume of a cylinder = πr^2 × height.', 'Square the radius, then multiply by the height and π.'],
    walkthrough: ['Volume = πr^2 × h', 'Volume = π(2)^2 × 5 = π(4)(5) = 20π'],
  },
  {
    id: 'gt-av-4',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A triangle has a base of 6 and a height of 4. What is its area?',
    correctAnswer: '12',
    hints: ['Area of a triangle = (1/2) × base × height.', 'Multiply 6 by 4, then take half.'],
    walkthrough: ['Area = (1/2) × base × height', 'Area = (1/2) × 6 × 4 = (1/2) × 24 = 12'],
  },
  {
    id: 'gt-av-5',
    domain: 'geometry-and-trigonometry',
    subsection: 'area-and-volume',
    difficulty: 'easy',
    prompt: 'A cube has a side length of 3. What is its volume?',
    correctAnswer: '27',
    hints: ['Volume of a cube = side^3.', 'Cube the side length: 3 × 3 × 3.'],
    walkthrough: ['Volume = side^3', 'Volume = 3^3 = 27'],
  },
]
```

```ts
// src/content/math/geometryAndTrigonometry/linesAnglesTriangles.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'geometry-and-trigonometry',
  subsection: 'lines-angles-triangles',
  title: 'Lines, Angles, and Triangles',
  summary: 'Use angle relationships (supplementary, vertical, triangle sum, exterior angle) to find missing angles.',
  body: "Angles on a straight line sum to 180°. Vertical angles (formed by two intersecting lines, across from each other) are always equal. The three interior angles of any triangle always sum to 180°. The exterior angle of a triangle equals the sum of the two interior angles that are not adjacent to it (the 'remote interior angles'). An isosceles triangle has two equal sides and the two angles opposite those sides are also equal.",
  tips: [
    "When you see a straight line cut by another line, the two angles formed on one side always add to 180°.",
    "Vertical angles (opposite each other at an intersection) are always equal — never assume adjacent angles are equal.",
    'If a triangle has a line extended beyond one vertex, the exterior angle formed equals the sum of the two angles at the other two vertices.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'gt-lat-1',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'easy',
    prompt: 'Two angles that lie on a straight line sum to 180°. If one angle is 65°, what is the other angle?',
    correctAnswer: '115',
    hints: ['Angles on a straight line sum to 180°.', 'Subtract 65 from 180.'],
    walkthrough: ['180 - 65 = 115', 'The other angle is 115°'],
  },
  {
    id: 'gt-lat-2',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'easy',
    prompt: 'A triangle has two angles measuring 50° and 60°. What is the measure of the third angle?',
    correctAnswer: '70',
    hints: ['The three angles of a triangle always sum to 180°.', 'Add the two given angles, then subtract from 180.'],
    walkthrough: ['50 + 60 = 110', '180 - 110 = 70', 'The third angle is 70°'],
  },
  {
    id: 'gt-lat-3',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'easy',
    prompt: 'Two lines intersect, forming vertical angles. If one of the angles measures 40°, what is the measure of the angle vertical to it?',
    correctAnswer: '40',
    hints: ['Vertical angles are always equal to each other.', 'No calculation is needed beyond recognizing this relationship.'],
    walkthrough: ['Vertical angles are always congruent', 'The vertical angle also measures 40°'],
  },
  {
    id: 'gt-lat-4',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'medium',
    prompt: 'A triangle has interior angles of 70° and 50° at two of its vertices. What is the measure of the exterior angle at the third vertex?',
    correctAnswer: '120',
    hints: ['The exterior angle equals the sum of the two remote interior angles.', 'Add the two given angles together.'],
    walkthrough: ['Exterior angle = sum of the two remote interior angles', 'Exterior angle = 70 + 50 = 120°'],
  },
  {
    id: 'gt-lat-5',
    domain: 'geometry-and-trigonometry',
    subsection: 'lines-angles-triangles',
    difficulty: 'medium',
    prompt: 'An isosceles triangle has a vertex angle of 40° and two equal base angles. What is the measure of each base angle?',
    correctAnswer: '70',
    hints: ['All three angles sum to 180°.', 'Subtract the vertex angle from 180, then divide the remainder equally between the two base angles.'],
    walkthrough: ['180 - 40 = 140', '140 / 2 = 70', 'Each base angle measures 70°'],
  },
]
```

```ts
// src/content/math/geometryAndTrigonometry/rightTriangleTrigCircles.ts
import type { Lesson, Question } from '../../types'

export const lesson: Lesson = {
  domain: 'geometry-and-trigonometry',
  subsection: 'right-triangle-trig-circles',
  title: 'Right Triangle Trigonometry and Circles',
  summary: 'Use the Pythagorean theorem, special right triangles, basic trig ratios, and the circle equation.',
  body: "The Pythagorean theorem a^2 + b^2 = c^2 relates the two legs and hypotenuse of a right triangle. Memorize the common Pythagorean triple 3-4-5 and the special right triangle ratios: in a 30-60-90 triangle, the sides are in ratio 1 : √3 : 2 (short leg : long leg : hypotenuse). The basic trig ratios are sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent; memorize sin(30°) = cos(60°) = 1/2. A circle's equation (x - h)^2 + (y - k)^2 = r^2 has center (h, k) and radius r — graphing it on Desmos instantly shows you the center and radius.",
  tips: [
    'Recognize 3-4-5 and 30-60-90 triangles immediately — they appear constantly and save time over using the Pythagorean theorem from scratch.',
    'In the circle equation (x-h)^2+(y-k)^2=r^2, the radius is the square root of the number on the right side, not the number itself.',
    'sin(30°) = cos(60°) = 1/2 — complementary angles have swapped sine and cosine values.',
  ],
  videoId: 'REPLACE_WITH_REAL_ID',
}

export const questions: Question[] = [
  {
    id: 'gt-rtc-1',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'easy',
    prompt: 'A right triangle has legs of length 3 and 4. What is the length of its hypotenuse?',
    correctAnswer: '5',
    hints: ['Use the Pythagorean theorem: a^2 + b^2 = c^2.', 'This is the well-known 3-4-5 right triangle.'],
    walkthrough: ['3^2 + 4^2 = c^2', '9 + 16 = 25 = c^2', 'c = 5'],
  },
  {
    id: 'gt-rtc-2',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'medium',
    prompt: 'What is sin(30°)? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '1/2',
    hints: ['This is one of the standard special-angle values worth memorizing.', 'Think of the 30-60-90 triangle with sides 1, √3, 2.'],
    walkthrough: ['In a 30-60-90 triangle, the side opposite 30° is the shortest side, 1, and the hypotenuse is 2', 'sin(30°) = opposite/hypotenuse = 1/2'],
  },
  {
    id: 'gt-rtc-3',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'medium',
    prompt: 'A circle is given by the equation (x - 2)^2 + (y + 1)^2 = 16. What is its radius?',
    correctAnswer: '4',
    hints: ['Compare to the standard form (x - h)^2 + (y - k)^2 = r^2.', 'The number on the right side is r^2, not r.'],
    walkthrough: ['r^2 = 16', 'r = 4'],
    desmosConfig: { expressions: ['(x-2)^2+(y+1)^2=16'], bounds: { left: -5, right: 9, top: 7, bottom: -9 } },
  },
  {
    id: 'gt-rtc-4',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'medium',
    prompt: 'What is cos(60°)? (Enter as a reduced fraction, e.g. 1/2.)',
    correctAnswer: '1/2',
    hints: ['Think of the 30-60-90 triangle with sides 1, √3, 2.', 'cos(60°) = adjacent/hypotenuse using the side adjacent to the 60° angle.'],
    walkthrough: ['In a 30-60-90 triangle, the side adjacent to 60° is the shortest side, 1, and the hypotenuse is 2', 'cos(60°) = adjacent/hypotenuse = 1/2'],
  },
  {
    id: 'gt-rtc-5',
    domain: 'geometry-and-trigonometry',
    subsection: 'right-triangle-trig-circles',
    difficulty: 'hard',
    prompt: 'In a 30-60-90 triangle, the short leg has length 5. What is the length of the hypotenuse?',
    correctAnswer: '10',
    hints: ['The side ratios in a 30-60-90 triangle are 1 : √3 : 2 (short leg : long leg : hypotenuse).', 'The hypotenuse is always twice the short leg.'],
    walkthrough: ['Ratio: short leg : hypotenuse = 1 : 2', 'Hypotenuse = 5 × 2 = 10'],
  },
]
```

- [ ] **Step 2: Write the domain registration module**

```ts
// src/content/math/geometryAndTrigonometry/index.ts
import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as avLesson, questions as avQuestions } from './areaAndVolume'
import { lesson as latLesson, questions as latQuestions } from './linesAnglesTriangles'
import { lesson as rtcLesson, questions as rtcQuestions } from './rightTriangleTrigCircles'

export function registerGeometryAndTrigonometry(): DomainMeta {
  registerContent('geometry-and-trigonometry', 'area-and-volume', avLesson, avQuestions)
  registerContent('geometry-and-trigonometry', 'lines-angles-triangles', latLesson, latQuestions)
  registerContent('geometry-and-trigonometry', 'right-triangle-trig-circles', rtcLesson, rtcQuestions)
  return {
    slug: 'geometry-and-trigonometry',
    title: 'Geometry and Trigonometry',
    subsections: [
      { slug: 'area-and-volume', title: 'Area and Volume' },
      { slug: 'lines-angles-triangles', title: 'Lines, Angles, and Triangles' },
      { slug: 'right-triangle-trig-circles', title: 'Right Triangle Trig and Circles' },
    ],
  }
}
```

- [ ] **Step 3: Add it to `src/content/index.ts`**

```ts
// src/content/index.ts
import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'
import { registerStandardEnglishConventions } from './readingWriting/standardEnglishConventions'
import { registerAlgebra } from './math/algebra'
import { registerAdvancedMath } from './math/advancedMath'
import { registerProblemSolvingDataAnalysis } from './math/problemSolvingDataAnalysis'
import { registerGeometryAndTrigonometry } from './math/geometryAndTrigonometry'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [
      registerInformationAndIdeas(),
      registerCraftAndStructure(),
      registerExpressionOfIdeas(),
      registerStandardEnglishConventions(),
    ],
  },
  {
    slug: 'math',
    title: 'Math',
    domains: [
      registerAlgebra(),
      registerAdvancedMath(),
      registerProblemSolvingDataAnalysis(),
      registerGeometryAndTrigonometry(),
    ],
  },
]
```

- [ ] **Step 4: Run the full test suite**

Run: `npm run test`
Expected: PASS. Both sections (Reading & Writing and Math) are now fully populated.

- [ ] **Step 5: Commit**

```bash
git add src/content/math/geometryAndTrigonometry src/content/index.ts
git commit -m "Add Geometry and Trigonometry lessons and practice questions with Desmos"
```

---

## Task 14: Desmos Tricks Hub

Replaces the temporary stub pages from Task 5 (`src/pages/DesmosTricksHub.tsx`, `src/pages/DesmosTopicPage.tsx`) with real implementations backed by content data, following the same registry pattern as the lesson/question content tasks.

**Files:**
- Modify: `src/content/types.ts` (add `DesmosTopic`)
- Modify: `src/content/registry.ts` (add `registerDesmosTopic`, `getDesmosTopics`, `getDesmosTopic`)
- Create: `src/content/desmosTricks/intersections.ts`
- Create: `src/content/desmosTricks/regression.ts`
- Create: `src/content/desmosTricks/tableMode.ts`
- Create: `src/content/desmosTricks/solvingWithoutAlgebra.ts`
- Create: `src/content/desmosTricks/index.ts`
- Modify: `src/content/index.ts`
- Modify: `src/pages/DesmosTricksHub.tsx` (replace stub)
- Modify: `src/pages/DesmosTopicPage.tsx` (replace stub)
- Test: `src/pages/DesmosTricksHub.test.tsx`
- Test: `src/pages/DesmosTopicPage.test.tsx`

**Interfaces:**
- Consumes: `DesmosConfig` (Task 2); `DesmosCalculator` (Task 3).
- Produces: `DesmosTopic` type; `registerDesmosTopic(topic)`, `getDesmosTopics(): DesmosTopic[]`, `getDesmosTopic(slug): DesmosTopic` from the registry.

- [ ] **Step 1: Add the `DesmosTopic` type**

```ts
// src/content/types.ts — add this interface alongside the existing ones
export interface DesmosTopic {
  slug: string
  title: string
  summary: string
  body: string
  tips: string[]
  desmosConfig: DesmosConfig
}
```

- [ ] **Step 2: Extend the registry**

```ts
// src/content/registry.ts — add alongside the existing lesson/question registry
import type { DesmosTopic } from './types'

const desmosTopics: DesmosTopic[] = []

export function registerDesmosTopic(topic: DesmosTopic) {
  desmosTopics.push(topic)
}

export function getDesmosTopics(): DesmosTopic[] {
  return desmosTopics
}

export function getDesmosTopic(slug: string): DesmosTopic {
  const topic = desmosTopics.find(t => t.slug === slug)
  if (!topic) throw new Error(`No Desmos topic registered for ${slug}`)
  return topic
}
```

- [ ] **Step 3: Write the four topic content files**

```ts
// src/content/desmosTricks/intersections.ts
import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'intersections',
  title: 'Finding Intersections for Systems of Equations',
  summary: 'Graph both equations and let Desmos show you exactly where they cross.',
  body: "Instead of solving a system of equations algebraically, type each equation into Desmos exactly as given. Desmos draws both lines (or curves) automatically. Click directly on the point where they cross, and Desmos displays its exact coordinates — that point is your solution. This works for any system, including ones with a line and a curve, not just two lines.",
  tips: [
    'Type equations in the same form the question gives them — Desmos accepts y = ... and standard form like 3x + 2y = 12 equally well.',
    'If the lines never appear to cross on screen, drag to zoom out — they may intersect far from the default view.',
    'Click directly on the intersection point (not just near it) to make Desmos display its exact coordinates.',
  ],
  desmosConfig: { expressions: ['y=2x+1', 'y=-x+7'], bounds: { left: -5, right: 10, top: 10, bottom: -5 } },
}
```

```ts
// src/content/desmosTricks/regression.ts
import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'regression',
  title: 'Using Regression for Data Analysis Questions',
  summary: 'Fit a line to a set of data points to answer trend and prediction questions.',
  body: "When a question gives you several data points and asks for a 'line of best fit' or asks you to predict a value, you can plot the points in Desmos and visually fit a line through them, then read off the slope and intercept, or estimate a value by eye. A line close to the pattern of a scattered set of points can often rule out two or three answer choices immediately, even without computing the exact regression line by hand.",
  tips: [
    'Plot each given data point individually as an ordered pair, like (1, 2), before trying to fit a line.',
    'A rough line through the "middle" of the scattered points is usually enough to eliminate answer choices that are clearly too steep or too shallow.',
    'If answer choices give specific equations, graph each one against your plotted points to see which fits best.',
  ],
  desmosConfig: { expressions: ['(1,2)', '(2,4)', '(3,5)', '(4,9)', 'y=2.2x-0.5'], bounds: { left: -1, right: 6, top: 10, bottom: -1 } },
}
```

```ts
// src/content/desmosTricks/tableMode.ts
import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'table-mode',
  title: 'Plugging In Answer Choices by Graphing Both Sides',
  summary: 'Turn an equation with an unknown into two graphs and read the solution off their intersection.',
  body: "When you are unsure how to solve an equation algebraically, or want to double check your answer, graph the left side of the equation as one function and the right side as another. For example, to solve 3x - 7 = 11, graph y = 3x - 7 and y = 11 separately. The x-coordinate where they intersect is the solution to the original equation. This also works well for checking which multiple-choice answer is correct: graph the equation and look at the x-value where it crosses the horizontal line matching each answer choice.",
  tips: [
    'Split any equation into "left side = y" and "right side = y" as two separate expressions.',
    'The x-coordinate of their intersection is always the solution to the original equation.',
    'This trick works especially well for equations that are awkward to solve by hand, like ones mixing variables inside and outside a square root or absolute value.',
  ],
  desmosConfig: { expressions: ['y=3x-7', 'y=11'], bounds: { left: -5, right: 15, top: 20, bottom: -10 } },
}
```

```ts
// src/content/desmosTricks/solvingWithoutAlgebra.ts
import type { DesmosTopic } from '../types'

export const topic: DesmosTopic = {
  slug: 'solving-without-algebra',
  title: 'Solving Equations Without Doing the Algebra',
  summary: 'Graph both sides of any equation and read the solution directly off the intersection point.',
  body: "This is the most general Desmos trick: for any equation, no matter how complicated, graph the left-hand side as y1 and the right-hand side as y2, then find where the two graphs cross. The x-coordinate of that intersection point is the solution — you never had to isolate the variable by hand. This is especially useful under time pressure, or for an equation you don't immediately recognize how to solve algebraically.",
  tips: [
    'This trick works for any equation type: linear, quadratic, absolute value, even equations with the variable on both sides in a complicated way.',
    'If there are two intersection points, the equation has two solutions — check whether the question wants the smaller, larger, or sum of both.',
    'Always sanity-check the intersection x-value by plugging it back into the original equation.',
  ],
  desmosConfig: { expressions: ['y=2(x-3)', 'y=x+1'], bounds: { left: -5, right: 15, top: 15, bottom: -10 } },
}
```

- [ ] **Step 4: Write the registration module and wire it into `src/content/index.ts`**

```ts
// src/content/desmosTricks/index.ts
import { registerDesmosTopic } from '../registry'
import { topic as intersectionsTopic } from './intersections'
import { topic as regressionTopic } from './regression'
import { topic as tableModeTopic } from './tableMode'
import { topic as solvingWithoutAlgebraTopic } from './solvingWithoutAlgebra'

export function registerDesmosTricks() {
  registerDesmosTopic(intersectionsTopic)
  registerDesmosTopic(regressionTopic)
  registerDesmosTopic(tableModeTopic)
  registerDesmosTopic(solvingWithoutAlgebraTopic)
}
```

```ts
// src/content/index.ts — add alongside the existing imports and section assembly
import { registerDesmosTricks } from './desmosTricks'

export { getLesson, getQuestions, getDesmosTopics, getDesmosTopic } from './registry'

registerDesmosTricks()

// ... existing `export const sections: SectionMeta[] = [...]` stays unchanged below this
```

- [ ] **Step 5: Write the failing tests for the hub and topic pages**

```tsx
// src/pages/DesmosTricksHub.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import DesmosTricksHub from './DesmosTricksHub'

vi.mock('../content/index', () => ({
  getDesmosTopics: () => [
    { slug: 'intersections', title: 'Finding Intersections', summary: 'Graph both sides.', body: '...', tips: [], desmosConfig: { expressions: [] } },
  ],
}))

describe('DesmosTricksHub', () => {
  it('lists each topic with a link to its page', () => {
    render(<MemoryRouter><DesmosTricksHub /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /finding intersections/i })).toHaveAttribute('href', '/desmos-tricks/intersections')
  })
})
```

```tsx
// src/pages/DesmosTopicPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DesmosTopicPage from './DesmosTopicPage'

vi.mock('../content/index', () => ({
  getDesmosTopic: () => ({
    slug: 'intersections', title: 'Finding Intersections', summary: 'Graph both sides.',
    body: 'Explanation body.', tips: ['Tip one.'],
    desmosConfig: { expressions: ['y=2x+1'] },
  }),
}))

describe('DesmosTopicPage', () => {
  beforeEach(() => {
    // @ts-expect-error test double
    window.Desmos = { GraphingCalculator: vi.fn(() => ({ setExpression: vi.fn(), setMathBounds: vi.fn() })) }
  })

  it('renders the topic title, body, tips, and a live Desmos calculator', async () => {
    render(
      <MemoryRouter initialEntries={['/desmos-tricks/intersections']}>
        <Routes><Route path="/desmos-tricks/:topicSlug" element={<DesmosTopicPage />} /></Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /finding intersections/i })).toBeInTheDocument()
    expect(screen.getByText('Explanation body.')).toBeInTheDocument()
    expect(screen.getByText('Tip one.')).toBeInTheDocument()
    await waitFor(() => {
      // @ts-expect-error test double
      expect(window.Desmos.GraphingCalculator).toHaveBeenCalled()
    })
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `npm run test -- DesmosTricksHub DesmosTopicPage`
Expected: FAIL — stub pages render only "coming soon" placeholder text.

- [ ] **Step 7: Implement the real pages**

```tsx
// src/pages/DesmosTricksHub.tsx
import { Link } from 'react-router-dom'
import { getDesmosTopics } from '../content/index'

export default function DesmosTricksHub() {
  const topics = getDesmosTopics()
  return (
    <div>
      <h1>Desmos Tricks</h1>
      <p>Techniques for using the built-in Desmos calculator to solve SAT Math problems faster.</p>
      <ul>
        {topics.map(topic => (
          <li key={topic.slug}>
            <Link to={`/desmos-tricks/${topic.slug}`}>{topic.title}</Link> — {topic.summary}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

```tsx
// src/pages/DesmosTopicPage.tsx
import { useParams } from 'react-router-dom'
import { getDesmosTopic } from '../content/index'
import DesmosCalculator from '../components/DesmosCalculator'

export default function DesmosTopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  if (!topicSlug) return <p>Not found.</p>
  const topic = getDesmosTopic(topicSlug)

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.body}</p>
      <ul>
        {topic.tips.map(tip => <li key={tip}>{tip}</li>)}
      </ul>
      <DesmosCalculator config={topic.desmosConfig} />
    </div>
  )
}
```

- [ ] **Step 8: Run tests to verify they pass, then run the full suite**

Run: `npm run test`
Expected: PASS — every test from Tasks 1-14.

- [ ] **Step 9: Commit**

```bash
git add src/content/types.ts src/content/registry.ts src/content/desmosTricks src/content/index.ts src/pages/DesmosTricksHub.tsx src/pages/DesmosTopicPage.tsx src/pages/DesmosTricksHub.test.tsx src/pages/DesmosTopicPage.test.tsx
git commit -m "Add Desmos Tricks hub with four interactive tutorial topics"
```

---

## Task 15: Progress Bars on Overview Pages, README, and Final Verification

**Files:**
- Modify: `src/hooks/useProgress.ts` (export a non-hook `readCorrectCount` helper for use outside `Practice`)
- Modify: `src/pages/DomainPage.tsx` (show correct-count badge per subsection)
- Modify: `src/pages/SectionOverview.tsx` (show aggregate correct-count badge per domain)
- Modify: `src/pages/Home.tsx` (show site-wide aggregate progress)
- Test: `src/pages/DomainPage.test.tsx`
- Modify: `src/pages/SectionOverview.test.tsx`
- Test: `src/pages/Home.test.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: `getQuestions` (Task 2/registry); `sections` (Task 2 + content tasks).
- Produces: `readCorrectCount(subsectionKey: string, questionIds: string[]): number`, exported from `src/hooks/useProgress.ts` for synchronous reads outside the `Practice` component.

- [ ] **Step 1: Export `readCorrectCount` from `useProgress.ts`**

```ts
// src/hooks/useProgress.ts — add this export; loadProgress already exists from Task 2
export function readCorrectCount(subsectionKey: string, questionIds: string[]): number {
  const progress = loadProgress(subsectionKey)
  return questionIds.filter(id => progress[id]?.correct).length
}
```

- [ ] **Step 2: Write the failing DomainPage progress test**

```tsx
// src/pages/DomainPage.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DomainPage from './DomainPage'

vi.mock('../content/index', () => ({
  sections: [
    {
      slug: 'math',
      title: 'Math',
      domains: [
        { slug: 'algebra', title: 'Algebra', subsections: [{ slug: 'linear-equations-one-variable', title: 'Linear Equations' }] },
      ],
    },
  ],
  getQuestions: () => [{ id: 'alg-leov-1' }, { id: 'alg-leov-2' }],
}))

describe('DomainPage', () => {
  beforeEach(() => localStorage.clear())

  it('shows a correct-count badge for each subsection', () => {
    localStorage.setItem(
      'sat-prep-progress:algebra/linear-equations-one-variable',
      JSON.stringify({ 'alg-leov-1': { attempted: true, correct: true } })
    )
    render(
      <MemoryRouter initialEntries={['/math/algebra']}>
        <Routes><Route path="/:sectionSlug/:domainSlug" element={<DomainPage />} /></Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/1 \/ 2 correct/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- DomainPage`
Expected: FAIL — `DomainPage` does not render a progress badge yet.

- [ ] **Step 4: Update `DomainPage` to show the badge**

```tsx
// src/pages/DomainPage.tsx
import { Link, useParams } from 'react-router-dom'
import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'

export default function DomainPage() {
  const { sectionSlug, domainSlug } = useParams<{ sectionSlug: string; domainSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  const domain = section?.domains.find(d => d.slug === domainSlug)
  if (!section || !domain) return <p>Domain not found.</p>

  return (
    <div>
      <h1>{domain.title}</h1>
      <ul>
        {domain.subsections.map(sub => {
          const questions = getQuestions(domain.slug, sub.slug)
          const correct = readCorrectCount(`${domain.slug}/${sub.slug}`, questions.map(q => q.id))
          return (
            <li key={sub.slug}>
              <Link to={`/${section.slug}/${domain.slug}/${sub.slug}`}>{sub.title}</Link>
              {' '}<span>({correct} / {questions.length} correct)</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- DomainPage`
Expected: PASS

- [ ] **Step 6: Update `SectionOverview` to show an aggregate badge per domain, and update its test**

```tsx
// src/pages/SectionOverview.tsx
import { Link, useParams } from 'react-router-dom'
import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'

export default function SectionOverview() {
  const { sectionSlug } = useParams<{ sectionSlug: string }>()
  const section = sections.find(s => s.slug === sectionSlug)
  if (!section) return <p>Section not found.</p>

  return (
    <div>
      <h1>{section.title}</h1>
      <ul>
        {section.domains.map(domain => {
          let total = 0
          let correct = 0
          for (const sub of domain.subsections) {
            const questions = getQuestions(domain.slug, sub.slug)
            total += questions.length
            correct += readCorrectCount(`${domain.slug}/${sub.slug}`, questions.map(q => q.id))
          }
          return (
            <li key={domain.slug}>
              <Link to={`/${section.slug}/${domain.slug}`}>{domain.title}</Link>
              {' '}<span>({correct} / {total} correct)</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

```tsx
// src/pages/SectionOverview.test.tsx — replace the Task 5 version with this one
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SectionOverview from './SectionOverview'

vi.mock('../content/index', () => ({
  sections: [
    {
      slug: 'math',
      title: 'Math',
      domains: [
        { slug: 'algebra', title: 'Algebra', subsections: [{ slug: 'linear-equations-one-variable', title: 'Linear Equations in One Variable' }] },
      ],
    },
  ],
  getQuestions: () => [{ id: 'alg-leov-1' }, { id: 'alg-leov-2' }],
}))

describe('SectionOverview', () => {
  beforeEach(() => localStorage.clear())

  it('lists domains for the current section with links and an aggregate progress badge', () => {
    localStorage.setItem(
      'sat-prep-progress:algebra/linear-equations-one-variable',
      JSON.stringify({ 'alg-leov-1': { attempted: true, correct: true } })
    )
    render(
      <MemoryRouter initialEntries={['/math']}>
        <Routes><Route path="/:sectionSlug" element={<SectionOverview />} /></Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /math/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /algebra/i })).toHaveAttribute('href', '/math/algebra')
    expect(screen.getByText(/1 \/ 2 correct/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 7: Run both tests to verify they pass**

Run: `npm run test -- SectionOverview DomainPage`
Expected: PASS

- [ ] **Step 8: Write the failing Home progress test**

```tsx
// src/pages/Home.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from './Home'

vi.mock('../content/index', () => ({
  sections: [
    {
      slug: 'math', title: 'Math',
      domains: [{ slug: 'algebra', title: 'Algebra', subsections: [{ slug: 'linear-equations-one-variable', title: 'Linear Equations' }] }],
    },
  ],
  getQuestions: () => [{ id: 'alg-leov-1' }, { id: 'alg-leov-2' }],
}))

describe('Home', () => {
  beforeEach(() => localStorage.clear())

  it('shows a site-wide progress summary', () => {
    localStorage.setItem(
      'sat-prep-progress:algebra/linear-equations-one-variable',
      JSON.stringify({ 'alg-leov-1': { attempted: true, correct: true } })
    )
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText(/1 \/ 2 correct overall/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 9: Run test to verify it fails**

Run: `npm run test -- Home`
Expected: FAIL — `Home` does not show a progress summary yet.

- [ ] **Step 10: Update `Home` to show the site-wide summary**

```tsx
// src/pages/Home.tsx
import { Link } from 'react-router-dom'
import { sections, getQuestions } from '../content/index'
import { readCorrectCount } from '../hooks/useProgress'

export default function Home() {
  let total = 0
  let correct = 0
  for (const section of sections) {
    for (const domain of section.domains) {
      for (const sub of domain.subsections) {
        const questions = getQuestions(domain.slug, sub.slug)
        total += questions.length
        correct += readCorrectCount(`${domain.slug}/${sub.slug}`, questions.map(q => q.id))
      }
    }
  }

  return (
    <div>
      <h1>PSAT/SAT Study Guide</h1>
      <p>
        The digital SAT has two sections: Reading & Writing and Math. Each is scored
        200-800, for a combined 400-1600. Pick a section below, work through the lesson
        for a subsection, then practice with hints and full walkthroughs.
      </p>
      <p>{correct} / {total} correct overall</p>
      <ul>
        <li><Link to="/reading-writing">Reading & Writing</Link></li>
        <li><Link to="/math">Math</Link></li>
        <li><Link to="/desmos-tricks">Desmos Tricks</Link></li>
      </ul>
    </div>
  )
}
```

- [ ] **Step 11: Run test to verify it passes**

Run: `npm run test -- Home`
Expected: PASS

- [ ] **Step 12: Write the README**

```markdown
<!-- README.md -->
# PSAT/SAT Study Guide

A static, no-backend PSAT/SAT study site: lessons with embedded video, hand-crafted
practice questions with progressive hints and full walkthroughs, and an embedded
Desmos graphing calculator for math questions. Progress is saved per-device in
`localStorage` — there are no accounts and no server.

## Running locally

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test
```

## Building for production

```bash
npm run build
```

Outputs static files to `dist/`, deployable to any static host (Netlify, Vercel,
GitHub Pages, etc.).

## Desmos API key

`index.html` currently uses Desmos's publicly documented demo API key. Before any
real production deploy, register your own key at https://www.desmos.com/api and
swap it into the `<script>` tag's `apiKey` parameter.

## Adding more content

Every lesson and its practice questions live in one file under `src/content/`,
grouped by section (`readingWriting/` or `math/`) and then by domain. Each
domain has an `index.ts` that registers its subsections — follow that pattern
to add a new subsection, and add it to that domain's `subsections` list so it
appears in navigation.
```

- [ ] **Step 13: Run the full test suite, typecheck, and production build**

Run:
```bash
npm run test
npx tsc --noEmit
npm run build
```
Expected: all tests PASS, no TypeScript errors, and the production build completes successfully.

- [ ] **Step 14: Self-review against the spec**

Confirm each spec requirement has a corresponding task: site structure (Task 5), content data model (Task 2), practice question flow (Task 4), progress tracking (Tasks 2, 15), lesson/video pages (Task 4), Desmos embedding (Tasks 3, 10-14), and content volume (5 questions × 21 subsections across Tasks 6-13, plus the Desmos Tricks hub in Task 14). Confirm no task references a function, type, or component not defined in an earlier task.

- [ ] **Step 15: Commit**

```bash
git add src/hooks/useProgress.ts src/pages/DomainPage.tsx src/pages/DomainPage.test.tsx src/pages/SectionOverview.tsx src/pages/SectionOverview.test.tsx src/pages/Home.tsx src/pages/Home.test.tsx README.md
git commit -m "Add progress badges to overview pages and project README"
```
