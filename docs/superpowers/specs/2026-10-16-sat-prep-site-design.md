# PSAT/SAT Study Guide Website — Design Spec

## Purpose & Audience

A comprehensive, self-contained PSAT/SAT study website for individual
self-study students. No accounts, no server, no database — it is a
static site that works entirely in the browser. Success criteria: a
student can land on any domain/subsection, read a lesson (with video
and tips), work through hand-crafted practice questions with
progressive hints and full walkthroughs, and use embedded Desmos for
math questions — all without creating an account or losing progress
on repeat visits to the same browser.

## Stack

- **Vite + React + TypeScript** — static build, no backend.
- **React Router** for client-side navigation.
- Plain CSS / CSS Modules for styling — no heavy UI framework.
- Deployable as static files to any static host (Netlify, Vercel,
  GitHub Pages, etc.) — no server-side rendering required.
- Desmos: official Desmos API (`https://www.desmos.com/api/v1.9/calculator.js`),
  loaded via a `<script>` tag and wrapped in a small React component
  (`DesmosCalculator`) that mounts `Desmos.GraphingCalculator` /
  `Desmos.ScientificCalculator` into a div ref and pushes any
  `desmosConfig.expressions` into it on mount.

## Site Structure

```
/                          Home — what the test is, how to use the site
/reading-writing                     R&W domain overview
/reading-writing/:domain             e.g. information-and-ideas
/reading-writing/:domain/:subsection Lesson + Practice for a subsection
/math                                 Math domain overview
/math/:domain                        e.g. algebra
/math/:domain/:subsection            Lesson + Practice for a subsection
/desmos-tricks                        Dedicated Desmos tutorials hub
/desmos-tricks/:topic                 e.g. regression, intersections, tables
```

### Reading & Writing domains (official SAT domains)
1. **Information and Ideas** — central ideas/details, command of evidence (textual/quantitative), inferences
2. **Craft and Structure** — words in context, text structure/purpose, cross-text connections
3. **Expression of Ideas** — rhetorical synthesis, transitions
4. **Standard English Conventions** — boundaries (independent/dependent clauses, commas, semicolons, colons), form/structure/sense (agreement, pronouns, modifiers)

### Math domains (official SAT domains)
1. **Algebra** — linear equations/inequalities (1 & 2 variables), linear systems, linear functions
2. **Advanced Math** — nonlinear equations/functions, equivalent expressions
3. **Problem-Solving and Data Analysis** — ratios/rates/proportions, percentages, one/two-variable data, probability
4. **Geometry and Trigonometry** — area/volume, lines/angles/triangles, right triangle trig, circles

### Desmos Tricks (cross-cutting tutorial hub, linked from relevant math subsections)
Topics: graphing to check algebra, finding intersections for systems,
using regression for data analysis, table mode for plugging in
answer choices, solving equations without algebra, using the
calculator's geometry tool for circles/triangles.

Each subsection page (R&W or Math) = **Lesson** tab + **Practice** tab.

## Content Data Model

All content lives in typed TS data files under `src/content/`, one
file per subsection (e.g. `src/content/math/algebra/linear-equations.ts`),
grouped under `src/content/{reading-writing,math}/{domain}/`.

```ts
interface Question {
  id: string;
  domain: string;
  subsection: string;
  difficulty: "easy" | "medium" | "hard";
  passage?: string;          // R&W only
  prompt: string;
  choices?: string[];        // omitted for grid-in math questions
  correctAnswer: string;
  hints: string[];           // revealed progressively, one at a time
  walkthrough: string[];     // ordered full-solution steps
  desmosConfig?: {
    expressions: string[];   // Desmos expression strings to preload
    bounds?: { left: number; right: number; top: number; bottom: number };
  };
}

interface Lesson {
  domain: string;
  subsection: string;
  title: string;
  summary: string;
  body: string;              // explanation prose (markdown-lite: supports **bold**, lists)
  tips: string[];
  videoId: string;           // YouTube video ID to embed
}
```

Each subsection file exports `lesson: Lesson` and `questions: Question[]`
(5-8 questions). An index file (`src/content/index.ts`) aggregates all
domains/subsections for nav generation and progress tracking.

## Practice Question Flow

The `Practice` component renders one question at a time:
1. Show prompt (+ passage for R&W, + `DesmosCalculator` beside the
   question for math questions with `desmosConfig`).
2. Student selects an answer choice (or types a grid-in value) and hits Submit.
3. Immediate correct/incorrect feedback shown inline.
4. "Get a hint" button available before or after submitting — reveals
   `hints` one at a time without giving away the answer.
5. "Show walkthrough" button (always available after submit) reveals
   the full `walkthrough` steps.
6. "Next question" advances through the subsection's question set.

## Progress Tracking

`localStorage` only, keyed by question id: `{ attempted: boolean,
correct: boolean }`. A small `useProgress` hook reads/writes this and
is used to render progress bars (e.g. "3/6 correct") on subsection,
domain, and home overview pages. No sync across devices; clearing
browser storage resets progress. No PII collected.

## Lesson/Tutorial Pages

Each lesson page renders: title, summary, prose body (tips callout box
pulled out visually), one embedded YouTube video (`<iframe>` via
`youtube.com/embed/{videoId}`), and a link into Practice for that
subsection. Videos are curated by hand from reputable free sources
(Khan Academy's official SAT content, well-known SAT tutors) — one
video per subsection lesson, chosen for relevance and accuracy, not
auto-generated.

## Content Volume

5-8 hand-crafted questions per subsection. 4 R&W domains × ~3
subsections each + 4 Math domains × ~3 subsections each ≈ 24
subsections × ~6 questions ≈ ~140 questions total, each with full
hints and walkthroughs. Exact subsection breakdown finalized during
implementation planning based on official SAT content domain specs.

## Out of Scope (for this build)

- User accounts, login, or cross-device sync
- Backend/database/server-side anything
- Auto-generated or scraped questions — all questions are
  hand-crafted for correctness
- Timed full practice tests / adaptive difficulty (could be a later
  phase, not this build)
- Video hosting — videos are embedded from YouTube, not uploaded
