// editorExample.tsx
// Example of how to use the new suggestion architecture in your editor component

import React, { useState, useEffect } from 'react';
import {
  RawSuggestion,
  SuggestionWithPosition,
  computeSuggestionPositions,
  handleTextChange
} from './suggestionPositionManager';
// import { getMockEssay, getMockRawSuggestions } from './mockDataAdvanced';
import { getMockEssay, getMockRawSuggestions } from './mockData';

interface EditorProps {
  essayId: string;
}

export const EssayEditor: React.FC<EditorProps> = ({ essayId }) => {
  const [essay, setEssay] = useState(getMockEssay(essayId));
  const [rawSuggestions, setRawSuggestions] = useState<RawSuggestion[]>([]);
  const [positionedSuggestions, setPositionedSuggestions] = useState<SuggestionWithPosition[]>([]);
  const [currentText, setCurrentText] = useState(essay.text);

  // Load raw suggestions from database/mock data
  useEffect(() => {
    const suggestions = getMockRawSuggestions();
    setRawSuggestions(suggestions);
  }, [essayId]);

  // Compute positions whenever essay text or raw suggestions change
  useEffect(() => {
    const positioned = computeSuggestionPositions(rawSuggestions, currentText);
    setPositionedSuggestions(positioned);
  }, [rawSuggestions, currentText]);

  // Handle text changes (e.g., when user edits the essay)
  const handleTextChangeLocal = (newText: string, changeStart: number, changeEnd: number) => {
    const updatedSuggestions = handleTextChange(
      positionedSuggestions,
      currentText,
      newText,
      changeStart,
      changeEnd
    );

    setPositionedSuggestions(updatedSuggestions);
    setCurrentText(newText);
  };

  // Handle suggestion approval/rejection
  const handleSuggestionAction = (suggestionId: string, action: 'approve' | 'reject') => {
    setPositionedSuggestions(prev =>
      prev.map(s =>
        s.id === suggestionId
          ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' }
          : s
      )
    );
  };

  // Apply a suggestion to the text
  const applySuggestion = (suggestion: SuggestionWithPosition) => {
    if (suggestion.status !== 'open') return;

    const newText =
      currentText.slice(0, suggestion.anchor.start) +
      suggestion.editedText +
      currentText.slice(suggestion.anchor.end);

    // Mark suggestion as approved
    handleSuggestionAction(suggestion.id, 'approve');

    // Update text and recompute all positions
    setCurrentText(newText);
  };

  return (
    <div className="essay-editor">
      <div className="editor-header">
        <h2>Essay Editor</h2>
        <div className="suggestion-stats">
          {positionedSuggestions.filter(s => s.status === 'open').length} open suggestions
        </div>
      </div>

      <div className="editor-content">
        <div className="essay-text">
          <textarea
            value={currentText}
            onChange={(e) => handleTextChangeLocal(e.target.value, 0, currentText.length)}
            placeholder="Essay text..."
            rows={20}
            cols={80}
          />
        </div>

        <div className="suggestions-panel">
          <h3>Writing Suggestions</h3>
          {positionedSuggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className={`suggestion ${suggestion.status}`}
              style={{
                backgroundColor: suggestion.status === 'open' ? '#f0f8ff' :
                  suggestion.status === 'approved' ? '#f0fff0' :
                    suggestion.status === 'rejected' ? '#fff0f0' : '#f5f5f5'
              }}
            >
              <div className="suggestion-header">
                <span className="suggestion-id">{suggestion.id}</span>
                <span className="suggestion-status">{suggestion.status}</span>
              </div>

              <div className="suggestion-content">
                <div className="original-text">
                  <strong>Original:</strong> {suggestion.originalText}
                </div>
                <div className="edited-text">
                  <strong>Suggested:</strong> {suggestion.editedText}
                </div>
                {suggestion.note && (
                  <div className="suggestion-note">
                    <strong>Note:</strong> {suggestion.note}
                  </div>
                )}
              </div>

              {suggestion.status === 'open' && (
                <div className="suggestion-actions">
                  <button onClick={() => applySuggestion(suggestion)}>
                    Apply
                  </button>
                  <button onClick={() => handleSuggestionAction(suggestion.id, 'approve')}>
                    Approve
                  </button>
                  <button onClick={() => handleSuggestionAction(suggestion.id, 'reject')}>
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Usage example:
// <EssayEditor essayId="adv-001" /> 