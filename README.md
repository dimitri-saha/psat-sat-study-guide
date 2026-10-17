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
