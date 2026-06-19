# TSPerf Submission Packet

## Opportunity

Algora TSPerf Challenge

Link: https://algora.io/challenges/tsperf

## Why It Is Worth Trying

The challenge offers a large prize for a VS Code plugin that makes TypeScript type complexity or load time visible to developers.

This is a good fit for a public portfolio artifact even if it does not win, because a TypeScript performance tool is useful, concrete, and easy to demonstrate.

## Current Deliverable

This folder contains a starter VS Code extension:

- `package.json`
- `src/extension.js`
- `fixtures/expensive-types.ts`
- `README.md`
- `LICENSE`

The extension measures hover latency and returned type text size at the cursor.

The updated starter also includes a CLI demo:

```bash
npm run demo
```

This reads `fixtures/expensive-types.ts` and reports a static structural complexity score, so the project can still be verified in Codespaces even when Extension Development Host debugging is unavailable.

## Honest Status

This is an MVP, not a final prize-winning implementation.

It does not yet inspect TypeScript compiler internals or parse TypeScript server performance traces. It should be positioned as an early prototype unless further improved.

## User-Side Upload Steps

1. Create a new GitHub repository named `ts-type-cost-lens`.
2. Upload all files in this folder.
3. Open the repository in VS Code.
4. Run `npm install`.
5. Run `npm run demo`.
6. Run `npm test`.
7. If local VS Code extension debugging is available, press `F5` to launch an Extension Development Host.
8. Open `fixtures/expensive-types.ts`.
9. Put the cursor on `Example` or `score`.
10. Run `TS Type Cost Lens: Measure Type At Cursor`.
11. If it works, add screenshots to the README.
12. Only submit to Algora after improving the implementation beyond hover latency.

## Improvement Plan

1. Add code lenses for type aliases and interfaces.
2. Scan all exported types in a file.
3. Use repeated measurements and report median latency.
4. Add TypeScript server trace parsing.
5. Add a side panel ranking expensive symbols.
