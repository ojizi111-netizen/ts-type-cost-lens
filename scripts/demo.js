const fs = require("fs");
const path = require("path");
const {
  classifyTypeCost,
  estimateTypeStructureCost,
  rankTypeAliases
} = require("../src/typeCost");

const fixturePath = path.join(__dirname, "..", "fixtures", "expensive-types.ts");
const sourceText = fs.readFileSync(fixturePath, "utf8");
const analysis = estimateTypeStructureCost(sourceText);
const label = classifyTypeCost(0, sourceText.length, analysis.score);

console.log("TS Type Cost Lens demo");
console.log("");
console.log(`File: ${path.relative(process.cwd(), fixturePath)}`);
console.log(`Source length: ${sourceText.length} characters`);
console.log(`Structural score: ${analysis.score}`);
console.log(`Complexity label: ${label}`);
console.log("");
console.log("Signals:");

for (const [name, value] of Object.entries(analysis.signals)) {
  console.log(`- ${name}: ${value}`);
}

console.log("");
console.log("Top type aliases by estimated cost:");

for (const alias of rankTypeAliases(sourceText).slice(0, 5)) {
  console.log(
    `- ${alias.name} (line ${alias.line}): ${alias.score} / ${alias.label}`
  );
}

console.log("");
console.log(
  "Note: this CLI demo estimates static type-structure cost. The VS Code command measures hover latency at the cursor."
);
