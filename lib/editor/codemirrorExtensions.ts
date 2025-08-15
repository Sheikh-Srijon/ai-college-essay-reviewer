import { Extension } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";

interface Suggestion {
  id: string;
  startOffset: number;
  endOffset: number;
  type: string;
}

interface SuggestionStore {
  getAllSuggestions(): Suggestion[];
}

interface SuggestionsExtensionConfig {
  store: SuggestionStore;
  onClick: (id: string, rect: DOMRect) => void;
}

export function suggestionsExtension(config: SuggestionsExtensionConfig): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view: EditorView): DecorationSet {
        const suggestions = config.store.getAllSuggestions();
        const decorations = suggestions.map((suggestion) => {
          const from = suggestion.startOffset;
          const to = suggestion.endOffset;

          return Decoration.mark({
            class: "suggestion-highlight",
            attributes: {
              "data-suggestion-id": suggestion.id,
              "data-suggestion-type": suggestion.type,
            },
          }).range(from, to);
        });

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
              const rect = target.getBoundingClientRect();
              config.onClick(suggestionId, rect);
            }
          }
        },
      },
    }
  );
}
