# TS Type Cost Lens

A small VS Code extension prototype for inspecting TypeScript type hover latency and type display size at the current cursor position.

This project is a starter implementation inspired by the Algora TSPerf challenge:

- Build a VS Code plugin for TypeScript
- Show the complexity / time to load of a type
- Open source the solution under the MIT license

This is not a final prize-winning implementation. It is a clean MVP that can be published as a GitHub repository and iterated into a stronger challenge submission.

## What It Does

Run `TS Type Cost Lens: Measure Type At Cursor` from the command palette.

The extension:

1. Reads the active TypeScript or TSX document.
2. Uses VS Code's built-in hover provider to ask the TypeScript language service for hover/type information.
3. Measures how long the hover request takes.
4. Counts the size of the returned type text.
5. Shows a small report with:
   - hover latency
   - returned type text length
   - line and column
   - a simple complexity label

## Why This Exists

TypeScript type performance problems are often invisible. A developer may only notice that a file feels slow, but not which type is expensive to compute or display.

This prototype takes a pragmatic first step: measure the latency of type information at the cursor and turn it into a small feedback loop inside the editor.

## Current Limitations

- It measures hover latency, not the internal TypeScript checker cost.
- It uses type display length as a rough proxy, not a real compiler complexity metric.
- It does not yet rank all symbols in a file.
- It does not yet integrate directly with TypeScript server tracing.

## Better Next Steps

- Add a code lens above slow type aliases and interfaces.
- Parse TypeScript server logs to identify expensive type operations.
- Add file-wide scanning for exported symbols.
- Add a diagnostics panel for high-latency type hovers.
- Add benchmark fixtures with intentionally expensive conditional types.

## Development

Install dependencies:

```bash
npm install
```

Run the CLI demo:

```bash
npm run demo
```

Expected output includes a static structural score for `fixtures/expensive-types.ts`.

Open this folder in VS Code, then press `F5` to launch an Extension Development Host.

In the Extension Development Host:

1. Open a `.ts` or `.tsx` file.
2. Place your cursor on a symbol or type.
3. Run `TS Type Cost Lens: Measure Type At Cursor` from the command palette.

## Challenge Fit

This prototype addresses the user-facing part of the TSPerf idea: making type cost visible in VS Code.

To become a serious challenge submission, it should move beyond hover latency and integrate with deeper TypeScript server or compiler measurements.

## License

MIT
