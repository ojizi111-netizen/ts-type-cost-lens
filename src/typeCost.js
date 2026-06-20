function classifyTypeCost(elapsedMs, textLength, structuralScore = 0) {
  if (elapsedMs >= 750 || textLength >= 5000 || structuralScore >= 40) {
    return "high";
  }

  if (elapsedMs >= 250 || textLength >= 1500 || structuralScore >= 18) {
    return "medium";
  }

  return "low";
}

function flattenHoverText(hovers) {
  if (!Array.isArray(hovers)) {
    return "";
  }

  return hovers
    .flatMap((hover) => hover.contents || [])
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }

      if (part && typeof part.value === "string") {
        return part.value;
      }

      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}\n... truncated ...`;
}

function estimateTypeStructureCost(sourceText) {
  const signals = {
    conditionalTypes: countMatches(sourceText, /\bextends\b[\s\S]*?\?/g),
    mappedTypes: countMatches(sourceText, /\[[^\]]+\s+in\s+keyof\s+[^\]]+\]/g),
    inferKeywords: countMatches(sourceText, /\binfer\b/g),
    recursiveReferences: countRecursiveTypeReferences(sourceText),
    tupleSpreads: countMatches(sourceText, /\.\.\./g),
    indexedAccesses: countMatches(sourceText, /\[[^\]]+\]/g)
  };

  const score =
    signals.conditionalTypes * 6 +
    signals.mappedTypes * 5 +
    signals.inferKeywords * 4 +
    signals.recursiveReferences * 8 +
    signals.tupleSpreads * 3 +
    signals.indexedAccesses * 2;

  return {
    score,
    signals
  };
}

function rankTypeAliases(sourceText) {
  return extractTypeAliases(sourceText)
    .map((alias) => {
      const analysis = estimateTypeStructureCost(alias.declaration);
      return {
        ...alias,
        score: analysis.score,
        label: classifyTypeCost(0, alias.declaration.length, analysis.score),
        signals: analysis.signals
      };
    })
    .sort((left, right) => right.score - left.score);
}

function extractTypeAliases(sourceText) {
  const aliases = [];
  const pattern = /\bexport\s+type\s+|\btype\s+/g;
  let match;

  while ((match = pattern.exec(sourceText)) !== null) {
    const start = match.index;
    const nameMatch = sourceText.slice(pattern.lastIndex).match(/^\s*([A-Za-z_$][\w$]*)/);

    if (!nameMatch) {
      continue;
    }

    const name = nameMatch[1];
    const declarationEnd = findDeclarationEnd(sourceText, pattern.lastIndex);

    if (declarationEnd === -1) {
      continue;
    }

    aliases.push({
      name,
      start,
      declaration: sourceText.slice(start, declarationEnd + 1),
      line: sourceText.slice(0, start).split(/\r?\n/).length
    });

    pattern.lastIndex = declarationEnd + 1;
  }

  return aliases;
}

function findDeclarationEnd(sourceText, fromIndex) {
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  let angleDepth = 0;

  for (let index = fromIndex; index < sourceText.length; index += 1) {
    const char = sourceText[index];

    if (char === "{") braceDepth += 1;
    if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    if (char === "[") bracketDepth += 1;
    if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    if (char === "(") parenDepth += 1;
    if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    if (char === "<") angleDepth += 1;
    if (char === ">") angleDepth = Math.max(0, angleDepth - 1);

    if (
      char === ";" &&
      braceDepth === 0 &&
      bracketDepth === 0 &&
      parenDepth === 0 &&
      angleDepth === 0
    ) {
      return index;
    }
  }

  return -1;
}

function countMatches(text, pattern) {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function countRecursiveTypeReferences(sourceText) {
  const declarationPattern = /type\s+([A-Za-z_$][\w$]*)\b[\s\S]*?;/g;
  let count = 0;
  let match;

  while ((match = declarationPattern.exec(sourceText)) !== null) {
    const typeName = match[1];
    const declaration = match[0];
    const references = countMatches(
      declaration,
      new RegExp(`\\b${escapeRegExp(typeName)}\\b`, "g")
    );

    if (references > 1) {
      count += references - 1;
    }
  }

  return count;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  classifyTypeCost,
  extractTypeAliases,
  estimateTypeStructureCost,
  flattenHoverText,
  rankTypeAliases,
  truncate
};
