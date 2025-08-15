// suggestionPositionManager.ts
// This file contains utilities for managing suggestion positions in the client-side editor

export interface RawSuggestion {
  id: string;
  originalText: string;
  editedText: string;
  note?: string;
}

export interface SuggestionWithPosition extends RawSuggestion {
  anchor: { start: number; end: number; stickiness: "join_left" | "join_right" };
  status: "open" | "approved" | "rejected" | "stale";
}

// Convert raw suggestions to positioned suggestions by finding text in the essay
export function computeSuggestionPositions(
  rawSuggestions: RawSuggestion[],
  essayText: string
): SuggestionWithPosition[] {
  return rawSuggestions.map((suggestion) => {
    const start = essayText.indexOf(suggestion.originalText);

    if (start === -1) {
      // Text not found, mark as stale
      return {
        ...suggestion,
        anchor: { start: -1, end: -1, stickiness: "join_right" as const },
        status: "stale" as const,
      };
    }

    return {
      ...suggestion,
      anchor: {
        start,
        end: start + suggestion.originalText.length,
        stickiness: "join_right" as const,
      },
      status: "open" as const,
    };
  });
}

// Adjust suggestion positions when text changes occur
export function adjustSuggestionPositions(
  suggestions: SuggestionWithPosition[],
  changeStart: number,
  changeEnd: number,
  newTextLength: number
): SuggestionWithPosition[] {
  const changeLength = changeEnd - changeStart;
  const lengthDifference = newTextLength - changeLength;

  return suggestions.map((suggestion) => {
    // If suggestion is completely before the change, no adjustment needed
    if (suggestion.anchor.end <= changeStart) {
      return suggestion;
    }

    // If suggestion is completely after the change, shift by the length difference
    if (suggestion.anchor.start >= changeEnd) {
      return {
        ...suggestion,
        anchor: {
          ...suggestion.anchor,
          start: suggestion.anchor.start + lengthDifference,
          end: suggestion.anchor.end + lengthDifference,
        },
      };
    }

    // If suggestion overlaps with the change, mark it as stale
    if (suggestion.anchor.start < changeEnd && suggestion.anchor.end > changeStart) {
      return {
        ...suggestion,
        status: "stale" as const,
      };
    }

    return suggestion;
  });
}

// Validate suggestion positions against current text
export function validateSuggestionPositions(
  suggestions: SuggestionWithPosition[],
  text: string
): SuggestionWithPosition[] {
  return suggestions.map((suggestion) => {
    if (suggestion.anchor.start < 0 || suggestion.anchor.end > text.length) {
      return { ...suggestion, status: "stale" as const };
    }

    const textAtPosition = text.slice(suggestion.anchor.start, suggestion.anchor.end);
    if (textAtPosition !== suggestion.originalText) {
      return { ...suggestion, status: "stale" as const };
    }

    return suggestion;
  });
}

// Find suggestions by text content (fallback when positions fail)
export function findSuggestionsByText(
  suggestions: SuggestionWithPosition[],
  text: string
): SuggestionWithPosition[] {
  return suggestions.map((suggestion) => {
    // Try to find the original text in the current text
    const newStart = text.indexOf(suggestion.originalText);

    if (newStart === -1) {
      // Text not found, mark as stale
      return { ...suggestion, status: "stale" as const };
    }

    // Update position to new location
    return {
      ...suggestion,
      anchor: {
        ...suggestion.anchor,
        start: newStart,
        end: newStart + suggestion.originalText.length,
      },
    };
  });
}

// Comprehensive function to handle text changes and update all suggestions
export function handleTextChange(
  suggestions: SuggestionWithPosition[],
  oldText: string,
  newText: string,
  changeStart: number,
  changeEnd: number
): SuggestionWithPosition[] {
  // First, try to adjust positions
  let updatedSuggestions = adjustSuggestionPositions(
    suggestions,
    changeStart,
    changeEnd,
    newText.length
  );

  // Then validate all positions
  updatedSuggestions = validateSuggestionPositions(updatedSuggestions, newText);

  // For any stale suggestions, try to find them by text content
  const staleSuggestions = updatedSuggestions.filter((s) => s.status === "stale");
  const freshSuggestions = updatedSuggestions.filter((s) => s.status !== "stale");

  if (staleSuggestions.length > 0) {
    const recoveredSuggestions = findSuggestionsByText(staleSuggestions, newText);
    return [...freshSuggestions, ...recoveredSuggestions];
  }

  return updatedSuggestions;
}

// Alternative approach: Use line-based positioning instead of character positions
export function convertToLineBasedPositions(
  suggestions: SuggestionWithPosition[],
  text: string
): SuggestionWithPosition[] {
  const lines = text.split("\n");

  return suggestions.map((suggestion) => {
    // Find which line contains the suggestion
    let currentPos = 0;
    let startLine = 0;
    let endLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for newline

      if (
        currentPos <= suggestion.anchor.start &&
        suggestion.anchor.start < currentPos + lineLength
      ) {
        startLine = i;
      }
      if (currentPos <= suggestion.anchor.end && suggestion.anchor.end <= currentPos + lineLength) {
        endLine = i;
        break;
      }
      currentPos += lineLength;
    }

    return {
      ...suggestion,
      anchor: {
        ...suggestion.anchor,
        startLine,
        endLine,
        startChar:
          suggestion.anchor.start - (lines.slice(0, startLine).join("\n").length + startLine),
        endChar: suggestion.anchor.end - (lines.slice(0, endLine).join("\n").length + endLine),
      },
    };
  });
}
