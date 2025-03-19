'use client';

/**
 * Detects if a given text contains RTL script like Arabic
 * @param text The text to analyze
 * @returns Boolean indicating if text contains RTL characters
 */
export function containsRTL(text: string): boolean {
  if (!text) return false;
  
  // RTL Unicode ranges:
  // Arabic (0600-06FF)
  // Arabic Supplement (0750-077F)
  // Arabic Extended-A (08A0-08FF)
  // Arabic Presentation Forms-A (FB50-FDFF)
  // Arabic Presentation Forms-B (FE70-FEFF)
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
}

/**
 * Detects if a given text contains Latin script
 * @param text The text to analyze
 * @returns Boolean indicating if text contains Latin characters
 */
export function containsLatin(text: string): boolean {
  if (!text) return false;
  
  // Basic Latin, Latin-1 Supplement, Latin Extended-A, Latin Extended-B
  const latinRegex = /[A-Za-z\u00C0-\u00FF\u0100-\u017F\u0180-\u024F]/;
  return latinRegex.test(text);
}

/**
 * Determines if text contains both RTL and Latin scripts (mixed content)
 * @param text The text to analyze
 * @returns Boolean indicating if text contains mixed scripts
 */
export function isMixedContent(text: string): boolean {
  return containsRTL(text) && containsLatin(text);
}

/**
 * Sets the document direction based on content with enhanced mixed-content handling
 * @param text The text to analyze for direction
 */
export function setDocumentDirection(text: string | null | undefined): void {
  if (typeof window === 'undefined') return; // Skip during SSR
  
  // If no text, default to LTR
  if (!text) {
    document.documentElement.dir = 'ltr';
    return;
  }
  
  const hasRTL = containsRTL(text);
  const dir = hasRTL ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  
  // Add a data attribute to indicate if content is mixed
  const hasMixed = isMixedContent(text);
  document.documentElement.setAttribute('data-mixed-content', hasMixed.toString());
  
  // Dispatch an event that components can listen for to update their RTL state
  const event = new CustomEvent('directionchange', { 
    detail: { 
      direction: dir,
      isMixed: hasMixed
    } 
  });
  document.dispatchEvent(event);
}

/**
 * Listens for direction changes in the document
 * @param callback Function to call when direction changes
 * @returns Function to remove the event listener
 */
export function onDirectionChange(
  callback: (dir: 'rtl' | 'ltr', isMixed: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {}; // Skip during SSR
  
  const handler = (e: Event) => {
    const event = e as CustomEvent;
    callback(event.detail.direction, event.detail.isMixed);
  };
  
  document.addEventListener('directionchange', handler);
  return () => document.removeEventListener('directionchange', handler);
}

/**
 * Gets the current document direction
 * @returns 'rtl' or 'ltr'
 */
export function getDocumentDirection(): 'rtl' | 'ltr' {
  if (typeof window === 'undefined') return 'ltr'; // Default for SSR
  return document.documentElement.dir as 'rtl' | 'ltr' || 'ltr';
}

/**
 * Checks if the document has mixed content
 * @returns boolean indicating if document has mixed content
 */
export function hasMixedContent(): boolean {
  if (typeof window === 'undefined') return false; // Default for SSR
  return document.documentElement.getAttribute('data-mixed-content') === 'true';
}

/**
 * Helper function to mirror numbers for Arabic
 * @param num The number to format
 * @returns Formatted number string
 */
export function formatNumberForRTL(num: number): string {
  // If the document is in RTL mode, use Arabic numerals
  if (getDocumentDirection() === 'rtl') {
    // Use Arabic numeral formatting
    return num.toLocaleString('ar-EG');
  }
  return num.toString();
}

/**
 * Splits text into segments based on script direction (RTL vs LTR)
 * @param text The text to split
 * @returns Array of segments with direction information
 */
export function splitTextByDirection(text: string): Array<{text: string, isRTL: boolean}> {
  if (!text) return [];
  
  // This is a simplified implementation 
  // A more advanced version could use a proper bidirectional algorithm
  const segments: Array<{text: string, isRTL: boolean}> = [];
  let currentSegment = '';
  let currentIsRTL = false;
  
  // Process one character at a time
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charIsRTL = containsRTL(char);
    
    // If first character or same direction as current segment, add to current segment
    if (currentSegment.length === 0 || charIsRTL === currentIsRTL) {
      currentSegment += char;
      currentIsRTL = charIsRTL;
    } else {
      // Direction changed, push current segment and start a new one
      segments.push({ text: currentSegment, isRTL: currentIsRTL });
      currentSegment = char;
      currentIsRTL = charIsRTL;
    }
  }
  
  // Push the last segment if it exists
  if (currentSegment.length > 0) {
    segments.push({ text: currentSegment, isRTL: currentIsRTL });
  }
  
  return segments;
}

/**
 * Adds Unicode bidirectional isolation control characters to text segments
 * @param segments Array of text segments with direction information
 * @returns Text with proper bidirectional isolation
 */
export function isolateTextSegments(segments: Array<{text: string, isRTL: boolean}>): string {
  return segments.map(segment => {
    // Use Unicode bidirectional isolation marks:
    // U+2068 (FIRST STRONG ISOLATE) and U+2069 (POP DIRECTIONAL ISOLATE)
    const dir = segment.isRTL ? 'rtl' : 'ltr';
    return `<span class="${segment.isRTL ? 'arabic-segment' : 'latin-segment'}" dir="${dir}">${segment.text}</span>`;
  }).join('<span class="script-boundary"></span>');
}

/**
 * Wraps mixed content with proper direction isolation
 * @param text The text to process
 * @returns HTML string with proper bidirectional handling
 */
export function wrapMixedContent(text: string): string {
  if (!text) return '';
  
  if (!isMixedContent(text)) {
    // If not mixed, just set the direction
    const dir = containsRTL(text) ? 'rtl' : 'ltr';
    return `<span dir="${dir}">${text}</span>`;
  }
  
  // For mixed content, split by direction and isolate segments
  const segments = splitTextByDirection(text);
  return `<span class="mixed-script-container">${isolateTextSegments(segments)}</span>`;
}
