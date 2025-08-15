"use client";

import React, { useEffect, useRef, useState } from "react";
import { EditorState, ChangeDesc, Text } from "@codemirror/state";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import type { Essay, Suggestion } from "@/public/mockData";

type Props = {
  essay: Essay;
  suggestions: Suggestion[];
};

interface PopupState {
  suggestion: Suggestion;
  rect: DOMRect;
}

interface AnchoredSuggestion extends Suggestion {
  originalStart: number;
  originalEnd: number;
  currentStart: number;
  currentEnd: number;
}

export function EditorClient({ essay, suggestions }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [anchoredSuggestions, setAnchoredSuggestions] = useState<AnchoredSuggestion[]>([]);
  const changeHistoryRef = useRef<ChangeDesc[]>([]);

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

  // Initialize anchored suggestions with original positions
  useEffect(() => {
    const anchored = suggestions.map(suggestion => ({
      ...suggestion,
      originalStart: suggestion.anchor.start,
      originalEnd: suggestion.anchor.end,
      currentStart: suggestion.anchor.start,
      currentEnd: suggestion.anchor.end
    }));
    setAnchoredSuggestions(anchored);
    changeHistoryRef.current = []; // Reset change history
  }, [suggestions]);

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
  const createSuggestionsExtension = () => {
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
            this.decorations = this.buildDecorations(update.view);
          } else if (update.viewportChanged) {
            this.decorations = this.buildDecorations(update.view);
          }
        }

        buildDecorations(view: EditorView): DecorationSet {
          const openSuggestions = anchoredSuggestions.filter(s => s.status === 'open');
          const decorations = openSuggestions.map((suggestion) => {
            // Calculate current positions through all changes
            const { start, end } = mapPositionsThroughHistory(suggestion.originalStart, suggestion.originalEnd);

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
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const startState = EditorState.create({
      doc: essay.text,
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
  }, [essay.text, anchoredSuggestions]);

  const handleApprove = (suggestion: AnchoredSuggestion) => {
    console.log("Approving suggestion:", suggestion.id);
    // TODO: Implement approval logic
    setPopup(null);
  };

  const handleReject = (suggestion: AnchoredSuggestion) => {
    console.log("Rejecting suggestion:", suggestion.id);
    // TODO: Implement rejection logic
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
              <button className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800">
                Undo
              </button>
              <button className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-900 text-sm hover:bg-gray-300">
                Redo
              </button>
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