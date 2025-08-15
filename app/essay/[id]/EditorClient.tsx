"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { EditorState, ChangeDesc, Text } from "@codemirror/state";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import type { Essay } from "@/public/mockData";
import type { RawSuggestion } from "@/public/suggestionPositionManager";
import {
  SuggestionWithPosition,
  computeSuggestionPositions
} from "@/public/suggestionPositionManager";
// import type { Essay, Suggestion } from "@/public/mockDataAdvanced";

type Props = {
  essay: Essay;
  rawSuggestions: RawSuggestion[];
};

interface PopupState {
  suggestion: SuggestionWithPosition;
  rect: DOMRect;
}

interface AnchoredSuggestion extends SuggestionWithPosition {
  originalStart: number;
  originalEnd: number;
  currentStart: number;
  currentEnd: number;
}

export function EditorClient({ essay, rawSuggestions }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [anchoredSuggestions, setAnchoredSuggestions] = useState<AnchoredSuggestion[]>([]);
  const [currentEssayText, setCurrentEssayText] = useState(essay.text);
  const changeHistoryRef = useRef<ChangeDesc[]>([]);

  // Google Docs-style history: track actual changes, not text snapshots
  const [changeHistory, setChangeHistory] = useState<Array<{
    type: 'approve' | 'reject';
    suggestionId: string;
    change: ChangeDesc;
    suggestionStatus: 'open' | 'approved' | 'rejected';
  }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1); // -1 means no actions yet

  // Handle click outside popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setPopup(null);
      }
    };

    if (popup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popup]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [historyIndex, changeHistory.length]);

  // Initialize anchored suggestions with original positions
  useEffect(() => {
    // Compute positions from raw suggestions
    const positionedSuggestions = computeSuggestionPositions(rawSuggestions, currentEssayText);

    const anchored = positionedSuggestions.map(suggestion => ({
      ...suggestion,
      originalStart: suggestion.anchor.start,
      originalEnd: suggestion.anchor.end,
      currentStart: suggestion.anchor.start,
      currentEnd: suggestion.anchor.end
    }));
    setAnchoredSuggestions(anchored);
    changeHistoryRef.current = []; // Reset change history

    // Debug: Log positions to verify they're correct
    console.log("Essay text:", JSON.stringify(currentEssayText));
    positionedSuggestions.forEach(suggestion => {
      if (suggestion.anchor.start >= 0) {
        const textAtPosition = currentEssayText.slice(suggestion.anchor.start, suggestion.anchor.end);
        console.log(`Suggestion ${suggestion.id}: "${textAtPosition}" at [${suggestion.anchor.start}, ${suggestion.anchor.end}]`);
        console.log(`Expected: "${suggestion.originalText}"`);
        console.log(`Match: ${textAtPosition === suggestion.originalText ? '✓' : '✗'}`);
      } else {
        console.log(`Suggestion ${suggestion.id}: STALE - text not found`);
      }
    });
  }, [rawSuggestions, currentEssayText]);

  // Function to add change to history
  const addToChangeHistory = (type: 'approve' | 'reject', suggestionId: string, change: ChangeDesc, suggestionStatus: 'open' | 'approved' | 'rejected') => {
    // Remove any future history if we're not at the end
    const newHistory = changeHistory.slice(0, historyIndex + 1);

    // Add the new change
    newHistory.push({ type, suggestionId, change, suggestionStatus });

    setChangeHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    console.log('Added to change history:', { type, suggestionId, suggestionStatus });
    console.log('New history index:', newHistory.length - 1);
  };

  // Function to undo (Google Docs style)
  const handleUndo = () => {
    if (historyIndex >= 0) {
      const lastChange = changeHistory[historyIndex];
      console.log('Undoing change:', lastChange);

      if (lastChange.type === 'approve') {
        // Reverse the text change
        if (viewRef.current) {
          // For approve, we need to reverse the text change
          // This is complex - we'd need to store the original text positions
          // For now, let's just restore the suggestion status
          setAnchoredSuggestions(prev =>
            prev.map(s =>
              s.id === lastChange.suggestionId
                ? { ...s, status: 'open' as const }
                : s
            )
          );
        }
      } else if (lastChange.type === 'reject') {
        // For reject, just restore the suggestion status
        setAnchoredSuggestions(prev =>
          prev.map(s =>
            s.id === lastChange.suggestionId
              ? { ...s, status: 'open' as const }
              : s
          )
        );
      }

      // Move back in history
      setHistoryIndex(historyIndex - 1);
      console.log('New history index after undo:', historyIndex - 1);
    }
  };

  // Function to redo
  const handleRedo = () => {
    if (historyIndex < changeHistory.length - 1) {
      const nextChange = changeHistory[historyIndex + 1];
      console.log('Redoing change:', nextChange);

      if (nextChange.type === 'approve') {
        // Re-apply the text change
        setAnchoredSuggestions(prev =>
          prev.map(s =>
            s.id === nextChange.suggestionId
              ? { ...s, status: 'approved' as const }
              : s
          )
        );
      } else if (nextChange.type === 'reject') {
        // Re-apply the reject
        setAnchoredSuggestions(prev =>
          prev.map(s =>
            s.id === nextChange.suggestionId
              ? { ...s, status: 'rejected' as const }
              : s
          )
        );
      }

      // Move forward in history
      setHistoryIndex(historyIndex + 1);
      console.log('New history index after redo:', historyIndex + 1);
    }
  };

  // Function to map original positions through all accumulated changes
  const mapPositionsThroughHistory = (originalStart: number, originalEnd: number): { start: number; end: number } => {
    let start = originalStart;
    let end = originalEnd;

    // Apply each change in sequence to get final positions
    for (const change of changeHistoryRef.current) {
      // Map the current positions through this change
      start = change.mapPos(start);
      end = change.mapPos(end);

      // Note: change.mapPos already handles the insertion correctly
      // We don't need to manually expand the end position
    }

    return { start, end };
  };

  // Create decorations for suggestions with proper position mapping
  const createSuggestionsExtension = useCallback(() => {
    return ViewPlugin.fromClass(
      class {
        decorations: DecorationSet;

        constructor(view: EditorView) {
          this.decorations = this.buildDecorations(view);
        }

        update(update: ViewUpdate) {
          if (update.docChanged) {
            // Add the new change to our history
            changeHistoryRef.current.push(update.changes);

            // Rebuild decorations
            this.decorations = this.buildDecorations(update.view);
          } else if (update.viewportChanged) {
            this.decorations = this.buildDecorations(update.view);
          }
        }

        buildDecorations(view: EditorView): DecorationSet {
          const openSuggestions = anchoredSuggestions.filter(s => s.status === 'open');
          const decorations = openSuggestions.map((suggestion) => {
            // Use current positions from anchored suggestions
            const start = suggestion.currentStart;
            const end = suggestion.currentEnd;

            // Ensure ranges are within document bounds
            const boundedStart = Math.max(0, Math.min(start, view.state.doc.length));
            const boundedEnd = Math.max(boundedStart, Math.min(end, view.state.doc.length));

            // Check if range has collapsed (start == end or diff <= 0)
            if (boundedStart >= boundedEnd || (boundedEnd - boundedStart) <= 0) {
              return null; // Don't show highlight for collapsed ranges
            }

            // Only create decoration if range is valid
            if (boundedStart < boundedEnd && boundedEnd <= view.state.doc.length) {
              return Decoration.mark({
                class: "suggestion-highlight",
                attributes: {
                  "data-suggestion-id": suggestion.id,
                },
              }).range(boundedStart, boundedEnd);
            }

            return null;
          }).filter(Boolean);

          return Decoration.set(decorations);
        }
      },
      {
        decorations: (v) => v.decorations,
        eventHandlers: {
          click: (event, view) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains("suggestion-highlight")) {
              const suggestionId = target.getAttribute("data-suggestion-id");
              if (suggestionId) {
                const suggestion = anchoredSuggestions.find(s => s.id === suggestionId);
                if (suggestion) {
                  const rect = target.getBoundingClientRect();
                  setPopup({ suggestion, rect });
                }
              }
            }
          },
        },
      }
    );
  }, [anchoredSuggestions]);

  useEffect(() => {
    if (!containerRef.current) return;

    const startState = EditorState.create({
      doc: currentEssayText,
      extensions: [
        markdown(),
        EditorView.lineWrapping,
        createSuggestionsExtension(),
        EditorView.theme({
          "&": {
            height: "100%",
            border: "none",
            borderRadius: "0",
            fontSize: "14px",
            backgroundColor: "transparent"
          },
          ".cm-scroller": {
            padding: "0",
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
          },
          ".cm-content": {
            lineHeight: "1.6",
            padding: "0"
          },
          ".suggestion-highlight": {
            backgroundColor: "#fef3c7",
            borderBottom: "2px solid #f59e0b",
            cursor: "pointer",
            borderRadius: "2px",
            padding: "1px 2px",
            margin: "0 1px"
          },
          ".suggestion-highlight:hover": {
            backgroundColor: "#fde68a",
            borderBottomColor: "#d97706"
          }
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current
    });
    viewRef.current = view;

    return () => {
      view?.destroy();
      viewRef.current = null;
    };
  }, [currentEssayText, anchoredSuggestions, createSuggestionsExtension]);

  const handleApprove = (suggestion: AnchoredSuggestion) => {
    console.log("Approving suggestion:", suggestion.id);
    // Apply the text change
    if (viewRef.current) {
      const { start, end } = { start: suggestion.currentStart, end: suggestion.currentEnd };
      const transaction = viewRef.current.state.update({
        changes: {
          from: start,
          to: end,
          insert: suggestion.editedText
        }
      });
      viewRef.current.dispatch(transaction);

      // Add to change history
      addToChangeHistory('approve', suggestion.id, transaction.changes, 'approved');
    }

    // Update the current essay text to reflect the change
    const newText =
      currentEssayText.slice(0, suggestion.currentStart) +
      suggestion.editedText +
      currentEssayText.slice(suggestion.currentEnd);
    setCurrentEssayText(newText);

    // Mark suggestion as approved (this will remove the highlight)
    setAnchoredSuggestions(prev =>
      prev.map(s =>
        s.id === suggestion.id
          ? { ...s, status: 'approved' as const }
          : s
      )
    );

    // Close popup
    setPopup(null);
  };

  const handleReject = (suggestion: AnchoredSuggestion) => {
    console.log("Rejecting suggestion:", suggestion.id);
    // Add reject action to history (no text change, just record the action)
    // Create a proper ChangeDesc for reject since there's no actual text change
    const dummyChange = ChangeDesc.create(suggestion.currentStart, suggestion.currentEnd, '');
    addToChangeHistory('reject', suggestion.id, dummyChange, 'rejected');

    // Mark suggestion as rejected (this will remove the highlight)
    setAnchoredSuggestions(prev =>
      prev.map(s =>
        s.id === suggestion.id
          ? { ...s, status: 'rejected' as const }
          : s
      )
    );

    setPopup(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Editor Area - Centered A4 Paper Style */}
      <div className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Toolbar */}
          <div className="bg-white border border-gray-200 rounded-t-lg p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex === -1}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${historyIndex === -1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
              >
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === changeHistory.length - 1}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${historyIndex === changeHistory.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
              >
                Redo
              </button>
              <span className="text-xs text-gray-500 ml-2">
                {changeHistory.length > 0 ? `History: ${historyIndex + 1}/${changeHistory.length}` : 'No actions yet'}
              </span>
            </div>
          </div>

          {/* A4 Paper-like Editor */}
          <div className="bg-white border border-gray-200 rounded-b-lg shadow-lg min-h-[calc(100vh-200px)]">
            <div ref={containerRef} className="p-8" style={{
              minHeight: '297mm', // A4 height
              maxWidth: '210mm',  // A4 width
              margin: '0 auto',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }} />
          </div>
        </div>
      </div>

      {/* Suggestion Popup */}
      {popup && (
        <div
          ref={popupRef}
          style={{
            position: "fixed",
            top: popup.rect.bottom + 8,
            left: Math.min(popup.rect.left, window.innerWidth - 320),
            width: 300,
            zIndex: 50,
            backgroundColor: "#fed7aa", // Light orange background
            border: "1px solid #fdba74", // Orange border
            borderRadius: "8px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            padding: "16px"
          }}
          className="suggestion-popup"
        >
          <div className="space-y-3 mb-4">
            <div>
              <div className="text-xs text-orange-800 mb-1 font-medium">Edit:</div>
              <div className="bg-green-100 border border-green-300 p-2 rounded text-sm font-mono text-green-800">
                {popup.suggestion.editedText}
              </div>
            </div>

            {popup.suggestion.note && (
              <div>
                <div className="text-xs text-orange-800 mb-1 font-medium">Comment:</div>
                <div className="text-sm text-gray-800 bg-white border border-orange-200 p-2 rounded">
                  {popup.suggestion.note}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(popup.suggestion)}
              className="flex-1 px-3 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(popup.suggestion)}
              className="flex-1 px-3 py-2 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>

          <button
            onClick={() => setPopup(null)}
            className="absolute top-2 right-2 text-orange-600 hover:text-orange-800 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}