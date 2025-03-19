'use client';

import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

// Define plugin state interface
interface RTLPluginState {
  paragraphsRTL: Map<number, boolean>;
}

// PluginKey for the RTL support plugin
export const rtlPluginKey = new PluginKey<RTLPluginState>('rtl-support');

// Helper to detect if text is RTL
export function isRTL(text: string): boolean {
  // RTL Unicode ranges:
  // Arabic (0600-06FF)
  // Arabic Supplement (0750-077F)
  // Arabic Extended-A (08A0-08FF)
  // Arabic Presentation Forms-A (FB50-FDFF)
  // Arabic Presentation Forms-B (FE70-FEFF)
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
}

// RTL support plugin for ProseMirror
export const rtlSupportPlugin = new Plugin({
  key: rtlPluginKey,
  
  // Store RTL state for paragraphs
  state: {
    init(): RTLPluginState {
      return { paragraphsRTL: new Map() };
    },
    apply(tr, pluginState: RTLPluginState): RTLPluginState {
      // Clone the current state to avoid mutation
      const newState: RTLPluginState = {
        paragraphsRTL: new Map(pluginState.paragraphsRTL),
      };
      
      // If the document changed, update RTL detection
      if (tr.docChanged) {
        newState.paragraphsRTL.clear();
        
        // Analyze each paragraph to determine if it needs RTL
        tr.doc.descendants((node, pos) => {
          if (node.type.name === 'paragraph' || node.type.name === 'heading') {
            const nodeText = node.textContent;
            newState.paragraphsRTL.set(pos, isRTL(nodeText));
          }
        });
      }
      
      return newState;
    },
  },
  
  // Add decorations for RTL paragraphs
  props: {
    decorations(state) {
      const pluginState = this.getState(state);
      if (!pluginState) return DecorationSet.empty;
      
      const { paragraphsRTL } = pluginState;
      const decorations: Decoration[] = [];
      
      // Add RTL class to paragraphs with RTL content
      state.doc.descendants((node, pos) => {
        if ((node.type.name === 'paragraph' || node.type.name === 'heading') && 
            paragraphsRTL.get(pos)) {
          decorations.push(
            Decoration.node(pos, pos + node.nodeSize, {
              class: 'rtl-paragraph',
              dir: 'rtl',
            })
          );
        }
      });
      
      return DecorationSet.create(state.doc, decorations);
    },
    
    // Ensure input is handled correctly for RTL contexts
    handleTextInput(view, from, to, text) {
      // Regular ProseMirror behavior - let the default handler work
      return false;
    },
    
    // Handle bidirectional text interactions
    handleKeyDown(view, event) {
      // Special handling for arrow keys in RTL
      const isRTLContext = document.dir === 'rtl' || 
                           view.dom.closest('[dir="rtl"]') !== null;
                           
      if (isRTLContext) {
        // If needed, we could map arrow keys for RTL here
        // but most modern browsers handle this correctly now
      }
      
      return false;
    },
  },
});
