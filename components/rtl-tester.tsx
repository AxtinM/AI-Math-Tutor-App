'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Markdown } from './markdown';
import { 
  arabicShortSample, 
  arabicMixedSample, 
  arabicWithNumbers, 
  arabicLongSample, 
  arabicDocumentSample,
  enhancedMixedSample 
} from '@/lib/utils/rtl-test-content';
import { 
  containsRTL, 
  getDocumentDirection, 
  setDocumentDirection, 
  isMixedContent,
  wrapMixedContent,
  hasMixedContent
} from '@/lib/utils/rtl-helpers';

export function RTLTester() {
  const [text, setText] = useState('');
  const [isRTL, setIsRTL] = useState(false);
  const [isMixed, setIsMixed] = useState(false);
  const [showRawHTML, setShowRawHTML] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState('');
  
  // Update RTL state when text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateTextInfo(newText);
  };
  
  // Update text information
  const updateTextInfo = (newText: string) => {
    const hasRTL = containsRTL(newText);
    const mixed = isMixedContent(newText);
    
    setIsRTL(hasRTL);
    setIsMixed(mixed);
    
    // Update document direction
    setDocumentDirection(newText);
    
    // Generate HTML preview for mixed content
    if (mixed) {
      setHtmlPreview(wrapMixedContent(newText));
    }
  };
  
  // Load sample text
  const loadSample = (sampleType: string) => {
    let sampleText = '';
    
    switch(sampleType) {
      case 'short':
        sampleText = arabicShortSample;
        break;
      case 'mixed':
        sampleText = arabicMixedSample;
        break;
      case 'enhanced-mixed':
        sampleText = enhancedMixedSample;
        break;
      case 'numbers':
        sampleText = arabicWithNumbers;
        break;
      case 'long':
        sampleText = arabicLongSample;
        break;
      case 'document':
        sampleText = arabicDocumentSample;
        break;
      default:
        sampleText = '';
    }
    
    setText(sampleText);
    updateTextInfo(sampleText);
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>RTL Support Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="mb-2">Current text direction: <strong>{isRTL ? 'RTL' : 'LTR'}</strong></p>
            <p className="mb-2">Document direction: <strong>{getDocumentDirection()}</strong></p>
            <p className="mb-2">Mixed content: <strong>{isMixed ? 'Yes' : 'No'}</strong></p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => loadSample('short')} variant="outline">
              Short Arabic
            </Button>
            <Button onClick={() => loadSample('mixed')} variant="outline">
              Basic Mixed Text
            </Button>
            <Button onClick={() => loadSample('enhanced-mixed')} variant="outline" className="bg-green-50 dark:bg-green-900/20">
              Enhanced Mixed Text
            </Button>
            <Button onClick={() => loadSample('numbers')} variant="outline">
              Arabic with Numbers
            </Button>
            <Button onClick={() => loadSample('long')} variant="outline">
              Long Arabic Text
            </Button>
            <Button onClick={() => loadSample('document')} variant="outline">
              Arabic Document
            </Button>
            <Button onClick={() => setText('')} variant="outline" className="bg-red-50 dark:bg-red-900/20">
              Clear
            </Button>
          </div>
          
          <div className="mb-4">
            <Textarea 
              value={text} 
              onChange={handleTextChange}
              placeholder="Type or paste Arabic text here to test RTL support..."
              className="min-h-32 font-dubai"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          {isMixed && (
            <div className="mb-4">
              <Button 
                onClick={() => setShowRawHTML(!showRawHTML)} 
                variant="outline" 
                className="mb-2"
              >
                {showRawHTML ? 'Hide HTML' : 'Show HTML Structure'}
              </Button>
              
              {showRawHTML && (
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto text-xs">
                  <pre className="font-geist-mono">{htmlPreview}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Before (Original)</CardTitle>
          </CardHeader>
          <CardContent>
            {text ? (
              <div className={`p-4 rounded-md ${isRTL ? 'rtl-support' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br>') }} />
              </div>
            ) : (
              <p className="text-muted-foreground">Enter some text above to see the preview</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>After (Enhanced RTL Support)</CardTitle>
          </CardHeader>
          <CardContent>
            {text ? (
              <div className={`p-4 rounded-md ${isMixed ? 'mixed-content' : isRTL ? 'rtl-support' : ''}`}>
                <Markdown>{text}</Markdown>
              </div>
            ) : (
              <p className="text-muted-foreground">Enter some text above to see the preview</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {isMixed && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Bidirectional Text Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Your text contains both RTL (Arabic) and LTR (Latin) content. The enhanced RTL support 
              uses the following techniques:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li className="mb-1">Unicode bidirectional isolation</li>
              <li className="mb-1">Proper script segmentation</li>
              <li className="mb-1">Font pairing (Dubai for Arabic, Geist for Latin)</li>
              <li className="mb-1">Visual boundaries between script changes</li>
              <li className="mb-1">Paragraph-level direction detection</li>
            </ul>
            <p>
              This ensures both Arabic and Latin text are displayed correctly and harmoniously, 
              with each script using its own directionality while maintaining proper reading flow.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
