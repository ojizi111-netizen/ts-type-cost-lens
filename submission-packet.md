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

## Honest Status

This is an MVP, not a final prize-winning implementation.

It does not yet inspect TypeScript compiler internals or parse TypeScript server performance traces. It should be positioned as an early prototype unless further improved.

## User-Side Upload Steps

1. Create a new GitHub repository named `ts-type-cost-lens`.
2. Upload all files in this folder.
3. Open the repository in VS Code.
4. Run `npm install`.
5. Press `F5` to launch an Extension Development Host.
6. Open `fixtures/expensive-types.ts`.
7. Put the cursor on `Example` or `score`.
8. Run `TS Type Cost Lens: Measure Type At Cursor`.
9. If it works, add screenshots to the README.
10. Only submit to Algora after improving the implementation beyond hover latency.

## Improvement Plan

1. Add code lenses for type aliases and interfaces.
2. Scan all exported types in a file.
3. Use repeated measurements and report median latency.
4. Add TypeScript server trace parsing.
5. Add a side panel ranking expensive symbols.

