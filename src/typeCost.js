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
  estimateTypeStructureCost,
  flattenHoverText,
  truncate
};

