"use client";

import React from "react";

interface HighlightItem {
  id: string;
  originalText: string;
  editedText: string;
  note?: string;
  start: number;
  end: number;
}

interface HighlightsSidebarProps {
  highlights: HighlightItem[];
  onHighlightClick: (highlight: HighlightItem) => void;
  isVisible: boolean;
}

export function HighlightsSidebar({ highlights, onHighlightClick, isVisible }: HighlightsSidebarProps) {
  if (!isVisible || highlights.length === 0) return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 max-h-[80vh] overflow-y-auto bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg z-40">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          AI Suggestions ({highlights.length})
        </h3>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.id}
              onClick={() => onHighlightClick(highlight)}
              className="group cursor-pointer p-3 bg-yellow-50/60 hover:bg-yellow-100/80 border border-yellow-200/50 rounded-md transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-yellow-700 bg-yellow-200/50 px-2 py-1 rounded">
                  #{index + 1}
                </span>
                <span className="text-xs text-gray-500">
                  {highlight.originalText.length} → {highlight.editedText.length}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Original:</p>
                  <p className="text-sm text-gray-800 bg-white/70 p-2 rounded border border-gray-200/50">
                    {highlight.originalText}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Suggestion:</p>
                  <p className="text-sm text-gray-800 bg-green-50/70 p-2 rounded border border-green-200/50">
                    {highlight.editedText}
                  </p>
                </div>

                {highlight.note && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Comment:</p>
                    <p className="text-sm text-gray-700 bg-blue-50/70 p-2 rounded border border-blue-200/50">
                      {highlight.note}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-yellow-200/30">
                <p className="text-xs text-yellow-600 group-hover:text-yellow-700 transition-colors">
                  Click to focus on this highlight
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 