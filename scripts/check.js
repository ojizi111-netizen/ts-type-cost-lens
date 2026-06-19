const fs = require("fs");
const path = require("path");

const requiredFiles = [
  "package.json",
  "README.md",
  "src/extension.js",
  "scripts/check.js",
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

console.log("TS Type Cost Lens starter files look OK.");

