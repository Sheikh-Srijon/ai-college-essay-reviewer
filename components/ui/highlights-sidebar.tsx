"use client";

import React, { useState, useRef, useEffect } from "react";

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
  onApprove: (highlight: HighlightItem) => void;
  onReject: (highlight: HighlightItem) => void;
  isVisible: boolean;
  focusedHighlightId?: string | null; // New prop to track which highlight is focused from editor
}

export function HighlightsSidebar({ highlights, onHighlightClick, onApprove, onReject, isVisible, focusedHighlightId }: HighlightsSidebarProps) {
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(16); // Default top position

  // Calculate sidebar position to stay above editor bottom
  useEffect(() => {
    let ticking = false;

    const updateSidebarPosition = () => {
      if (sidebarRef.current) {
        const editorContainer = document.querySelector('.bg-white.border.border-gray-200.rounded-b-lg.shadow-lg.relative');
        if (editorContainer) {
          const editorRect = editorContainer.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Use actual sidebar height instead of hardcoded value
          const sidebarHeight = sidebarRef.current.offsetHeight;

          // Find the actual editor content (the text area)
          const editorContent = editorContainer.querySelector('[ref="containerRef"]') || editorContainer.querySelector('.cm-editor') || editorContainer;
          const contentRect = editorContent.getBoundingClientRect();

          // Use the actual content bottom, not the container bottom
          const actualEditorBottom = contentRect.bottom;

          // Start sidebar near the top of the editor, not at the bottom
          const editorTop = editorRect.top;
          const preferredTop = Math.max(16, editorTop + 20); // 20px below editor top

          // Calculate the maximum allowed top position to keep sidebar above actual editor content bottom
          const maxAllowedTop = actualEditorBottom - sidebarHeight - 20; // 20px margin above content bottom

          // Use preferred top position, but ensure it doesn't go below editor content bottom
          const finalTop = Math.min(preferredTop, maxAllowedTop);

          // Additional safety check: ensure sidebar doesn't go below viewport
          const viewportSafeTop = Math.min(finalTop, viewportHeight - sidebarHeight - 20);

          // Final safety check: ensure we're not positioning below the editor content
          const finalSafeTop = Math.min(viewportSafeTop, actualEditorBottom - sidebarHeight - 20);

          // Only update if position changed significantly (prevents micro-jitters)
          const currentTop = parseInt(sidebarRef.current.style.top) || 0;
          if (Math.abs(finalSafeTop - currentTop) > 2) { // 2px threshold
            setSidebarTop(finalSafeTop);
          }
        }
      }
      ticking = false;
    };

    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateSidebarPosition);
        ticking = true;
      }
    };

    // Initial position calculation with delay to ensure editor is rendered
    const initialTimer = setTimeout(updateSidebarPosition, 100);

    // Throttled scroll updates using requestAnimationFrame
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    // Also update on any DOM changes that might affect editor position
    const observer = new ResizeObserver(throttledUpdate);
    const editorContainer = document.querySelector('.bg-white.border.border-gray-200.rounded-b-lg.shadow-lg.relative');
    if (editorContainer) {
      observer.observe(editorContainer);
    }

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
      observer.disconnect();
    };
  }, []);

  // Scroll to focused card when it changes
  useEffect(() => {
    if (focusedHighlightId && sidebarRef.current) {
      const cardElement = document.querySelector(`[data-highlight-id="${focusedHighlightId}"]`);
      if (cardElement) {
        // Scroll the card into view within the sidebar
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });

        // Set the focused card state
        setFocusedCardId(focusedHighlightId);

        // Remove focus effect after 5 seconds
        setTimeout(() => {
          setFocusedCardId(null);
        }, 5000);
      }
    }
  }, [focusedHighlightId]);

  if (!isVisible || highlights.length === 0) return null;

  const handleCardClick = (highlight: HighlightItem) => {
    setFocusedCardId(highlight.id);
    onHighlightClick(highlight);

    // Remove focus effect after 5 seconds
    setTimeout(() => {
      setFocusedCardId(null);
    }, 5000);
  };

  return (
    <div
      ref={sidebarRef}
      className="fixed w-80 max-h-[80vh] overflow-y-auto bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg z-40 transition-all duration-300 ease-out"
      style={{
        left: 'calc(50% + 210mm/2 + 16px)', // Position to the right of A4 editor (210mm width)
        top: `${sidebarTop}px`
      }}
    >
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          AI Suggestions ({highlights.length})
        </h3>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.id}
              data-highlight-id={highlight.id}
              onClick={() => handleCardClick(highlight)}
              className={`group cursor-pointer p-3 bg-yellow-50/60 hover:bg-yellow-100/80 border border-yellow-200/50 rounded-md transition-all duration-200 hover:shadow-md ${focusedCardId === highlight.id ? 'sidebar-card-focus' : ''
                }`}
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
                <p className="text-xs text-yellow-600 group-hover:text-yellow-700 transition-colors mb-3">
                  Click to focus on this highlight
                </p>

                {/* Approve and Reject Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove(highlight);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(highlight);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 