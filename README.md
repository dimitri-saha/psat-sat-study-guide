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

## Known limitation: placeholder video IDs

Every lesson's `videoId` is currently set to the literal placeholder
`REPLACE_WITH_REAL_ID` — real video curation requires manual web verification
of each lesson's content and was deliberately deferred, so embedded videos are
non-functional until a future curation pass replaces these placeholders with
real IDs.

## Unlimited math practice

Every math subsection has a question generator in `src/content/generators/math.ts`.
After a student finishes the hand-written questions, practice keeps going with
freshly randomized SAT-style questions (new numbers, answer choices, hints, and
walkthroughs every time). Each math question shows a **blank** Desmos calculator —
students type the equations themselves — and "Show the Desmos solution" loads the
worked graph only after they submit.

To add a new question type, add another template to the `pick([...])` list in the
matching generator; `generators.test.ts` runs every generator thousands of times to
catch malformed questions.

## Adding more content

Every lesson and its practice questions live in one file under `src/content/`,
grouped by section (`readingWriting/` or `math/`) and then by domain. Each
domain has an `index.ts` that registers its subsections — follow that pattern
to add a new subsection, and add it to that domain's `subsections` list so it
appears in navigation.
