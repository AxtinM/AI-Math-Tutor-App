import { RTLTester } from '@/components/rtl-tester';
import { Markdown } from '@/components/markdown'; // Import Markdown component

const mixedListMarkdown = `
1.  Item one is in English.
2.  البند الثاني باللغة العربية.
3.  Item three has mixed content: هذا بعض النص العربي with some English text.
4.  هذا البند الرابع يحتوي على محتوى مختلط: some English text مع بعض النص العربي.
5.  Fifth item is purely English again.
`;

export default function RTLTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Arabic RTL Support Test</h1>
      <RTLTester />

      {/* Markdown List Test Section */}
      <div className="mt-8 border rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Markdown Mixed List Test</h2>
        <Markdown>{mixedListMarkdown}</Markdown>
      </div>

      <div className="mt-12 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">About RTL Support</h2>
        <p className="mb-4">
          This page demonstrates the application&apos;s support for Right-to-Left (RTL) languages like Arabic.
          You can test various aspects of RTL support, including:
        </p>
        <ul className="list-disc ml-6 mb-6">
          <li className="mb-2">Auto-detection of RTL text</li>
          <li className="mb-2">Correct text alignment and direction</li>
          <li className="mb-2">Bidirectional text support (mixed Arabic and English)</li>
          <li className="mb-2">Number formatting in RTL context</li>
          <li className="mb-2">Markdown rendering in RTL mode</li>
          <li className="mb-2">UI layout adjustments for RTL display</li>
        </ul>
        
        <h3 className="text-xl font-bold mb-2">Features Implemented</h3>
        <ul className="list-disc ml-6 mb-6">
          <li className="mb-2">ProseMirror RTL text editing support</li>
          <li className="mb-2">Automatic RTL detection and direction setting</li>
          <li className="mb-2">RTL-friendly UI component layout</li>
          <li className="mb-2">Paragraph-level direction detection</li>
          <li className="mb-2">Support for bidirectional text</li>
          <li className="mb-2">Dubai font for Arabic text</li>
        </ul>
      </div>
    </div>
  );
}
