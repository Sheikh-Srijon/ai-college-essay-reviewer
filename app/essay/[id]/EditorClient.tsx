"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { EditorState, ChangeDesc, Text } from "@codemirror/state";
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import type { Essay } from "@/public/mockData";
import type { RawSuggestion } from "@/public/suggestionPositionManager";
import {
  SuggestionWithPosition,
  computeSuggestionPositions,
  handleTextChange
} from "@/public/suggestionPositionManager";
import { HighlightsSidebar } from "@/components/ui/highlights-sidebar";
// import type { Essay, Suggestion } from "@/public/mockDataAdvanced";

type Props = {
  essay: Essay;
  rawSuggestions: RawSuggestion[];
};

interface PopupState {
  suggestion: AnchoredSuggestion;
  rect: DOMRect;
}

interface AnchoredSuggestion {
  id: string;
  originalText: string;
  editedText: string;
  note?: string;
  status: 'open' | 'approved' | 'rejected' | 'stale';
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
  const [focusedHighlightId, setFocusedHighlightId] = useState<string | null>(null);

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
        // Temporarily remove the popup when clicking outside
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
    const positionedSuggestions = computeSuggestionPositions(rawSuggestions, essay.text);

    const anchored = positionedSuggestions.map(suggestion => ({
      ...suggestion,
      originalStart: suggestion.anchor.start,
      originalEnd: suggestion.anchor.end,
      currentStart: suggestion.anchor.start,
      currentEnd: suggestion.anchor.end
    }));
    setAnchoredSuggestions(anchored);
    changeHistoryRef.current = []; // Reset change history
  }, [rawSuggestions, essay.text]);

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
        // Find the suggestion that was approved
        const suggestion = anchoredSuggestions.find(s => s.id === lastChange.suggestionId);
        if (suggestion) {
          // Reverse the text change by replacing the edited text with the original text
          const newText =
            currentEssayText.slice(0, suggestion.currentStart) +
            suggestion.originalText +
            currentEssayText.slice(suggestion.currentStart + suggestion.editedText.length);

          // Update the CodeMirror editor first
          if (viewRef.current) {
            const transaction = viewRef.current.state.update({
              changes: {
                from: suggestion.currentStart,
                to: suggestion.currentStart + suggestion.editedText.length,
                insert: suggestion.originalText
              }
            });
            viewRef.current.dispatch(transaction);

            // Update the current essay text to match what's actually in CodeMirror
            const actualNewText = viewRef.current.state.doc.toString();
            setCurrentEssayText(actualNewText);
          }
        }

        // Restore suggestion status
        setAnchoredSuggestions(prev =>
          prev.map(s =>
            s.id === lastChange.suggestionId
              ? { ...s, status: 'open' as const }
              : s
          )
        );
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
        // Find the suggestion that was approved
        const suggestion = anchoredSuggestions.find(s => s.id === nextChange.suggestionId);
        if (suggestion) {
          // Re-apply the text change
          const newText =
            currentEssayText.slice(0, suggestion.currentStart) +
            suggestion.editedText +
            currentEssayText.slice(suggestion.currentStart + suggestion.originalText.length);

          // Update the CodeMirror editor first
          if (viewRef.current) {
            const transaction = viewRef.current.state.update({
              changes: {
                from: suggestion.currentStart,
                to: suggestion.currentStart + suggestion.originalText.length,
                insert: suggestion.editedText
              }
            });
            viewRef.current.dispatch(transaction);

            // Update the current essay text to match what's actually in CodeMirror
            const actualNewText = viewRef.current.state.doc.toString();
            setCurrentEssayText(actualNewText);
          }
        }

        // Re-apply the approval status
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
    }

    // Ensure positions are valid
    start = Math.max(0, start);
    end = Math.max(start, end);

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
                  // Set the focused highlight ID to trigger sidebar scrolling
                  setFocusedHighlightId(suggestionId);

                  // Add visual focus effect to the highlighted text
                  target.classList.add('highlight-focus');
                  setTimeout(() => {
                    target.classList.remove('highlight-focus');
                  }, 5000);

                  // Clear the focus after a delay
                  setTimeout(() => {
                    setFocusedHighlightId(null);
                  }, 5000);
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
            padding: "0",
            textAlign: "justify"
          },
          ".suggestion-highlight": {
            backgroundColor: "#fef3c7",
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
      // Get the current positions through all changes
      const { start, end } = mapPositionsThroughHistory(suggestion.originalStart, suggestion.originalEnd);

      // Validate that the range is within document bounds
      const docLength = viewRef.current.state.doc.length;
      if (start >= docLength || end > docLength || start >= end) {
        console.error("Invalid range for suggestion:", { start, end, docLength, suggestionId: suggestion.id });
        return;
      }

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

      // Update the current essay text to match what's actually in CodeMirror
      const newText = viewRef.current.state.doc.toString();
      setCurrentEssayText(newText);
    }

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
    if (viewRef.current) {
      // Get the current positions through all changes
      const { start, end } = mapPositionsThroughHistory(suggestion.originalStart, suggestion.originalEnd);

      // Validate that the range is within document bounds
      const docLength = viewRef.current.state.doc.length;
      if (start >= docLength || end > docLength || start >= end) {
        console.error("Invalid range for suggestion:", { start, end, docLength, suggestionId: suggestion.id });
        return;
      }

      const dummyChange = ChangeDesc.create(start, end, '');
      addToChangeHistory('reject', suggestion.id, dummyChange, 'rejected');
    }

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
    <div className="flex flex-col bg-gray-50">
      {/* Main Editor Area - Centered A4 Paper Style */}
      <div className="flex justify-center p-6">
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
          <div className="bg-white border border-gray-200 rounded-b-lg shadow-lg relative">
            <div ref={containerRef} className="p-8" style={{
              minHeight: '297mm', // A4 height
              maxWidth: '210mm',  // A4 width
              margin: '0 auto',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }} />

            {/* Highlights Sidebar - Positioned relative to A4 editor */}
            <HighlightsSidebar
              highlights={anchoredSuggestions.filter(s => s.status === 'open').map(s => ({
                id: s.id,
                originalText: s.originalText,
                editedText: s.editedText,
                note: s.note,
                start: s.currentStart,
                end: s.currentEnd
              }))}
              focusedHighlightId={focusedHighlightId}
              onHighlightClick={(highlight) => {
                // Find the suggestion in anchoredSuggestions
                const suggestion = anchoredSuggestions.find(s => s.id === highlight.id);
                if (suggestion && viewRef.current) {
                  // Use the current positions directly (these are already updated after changes)
                  const start = suggestion.currentStart;
                  const end = suggestion.currentEnd;

                  // Set cursor position at the start of the highlight
                  viewRef.current.dispatch({
                    selection: { anchor: start, head: start }
                  });

                  // Force a layout update
                  viewRef.current.requestMeasure();

                  // More reliable scrolling - scroll to the position
                  setTimeout(() => {
                    if (viewRef.current) {
                      // Get the DOM element for the highlight
                      const highlightElement = document.querySelector(`[data-suggestion-id="${highlight.id}"]`);
                      if (highlightElement) {
                        // Scroll the highlight into view
                        highlightElement.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                          inline: 'center'
                        });

                        // Add visual focus effect
                        highlightElement.classList.add('highlight-focus');
                        setTimeout(() => {
                          highlightElement.classList.remove('highlight-focus');
                        }, 5000);
                      }
                    }
                  }, 100);
                }
              }}
              onApprove={(highlight) => {
                const suggestion = anchoredSuggestions.find(s => s.id === highlight.id);
                if (suggestion) {
                  handleApprove(suggestion);
                }
              }}
              onReject={(highlight) => {
                const suggestion = anchoredSuggestions.find(s => s.id === highlight.id);
                if (suggestion) {
                  handleReject(suggestion);
                }
              }}
              isVisible={anchoredSuggestions.filter(s => s.status === 'open').length > 0}
            />
          </div>
        </div>
      </div>


    </div>
  );
}