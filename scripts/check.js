const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "package.json",
  "README.md",
  "src/extension.js",
  "src/typeCost.js",
  "scripts/check.js",
  "scripts/demo.js",
  "fixtures/expensive-types.ts",
  "LICENSE",
  "submission-packet.md"
];

for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, "..", file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);

if (!packageJson.contributes || !Array.isArray(packageJson.contributes.commands)) {
  throw new Error("package.json must contribute at least one command");
}

const {
  extractTypeAliases,
  rankTypeAliases
} = require("../src/typeCost");
const fixture = fs.readFileSync(
  path.join(__dirname, "..", "fixtures", "expensive-types.ts"),
  "utf8"
);
const aliases = extractTypeAliases(fixture);

if (aliases.length < 2) {
  throw new Error("Expected fixture to include multiple type aliases");
}

const rankedAliases = rankTypeAliases(fixture);

if (rankedAliases[0].score < rankedAliases[rankedAliases.length - 1].score) {
  throw new Error("Type aliases should be sorted by descending score");
}

console.log("TS Type Cost Lens starter files look OK.");
