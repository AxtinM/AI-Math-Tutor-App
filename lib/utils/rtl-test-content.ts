/**
 * Collection of Arabic text samples for testing RTL functionality
 */

/**
 * Short Arabic sample text
 */
export const arabicShortSample = `مرحبًا بالعالم! هذا نص باللغة العربية.`;

/**
 * Basic Arabic text with mixed English
 */
export const arabicMixedSample = `هذا مثال على نص يحتوي على كلمات عربية و English words معًا.`;

/**
 * Enhanced mixed text sample with more complex mixing patterns
 * This is designed to showcase our improved bidirectional text handling
 */
export const enhancedMixedSample = `مرحباً بكم في عالم النصوص ثنائية الاتجاه!

This paragraph starts with English but includes العربية in the middle and then goes back to English. This tests our ability to handle script changes within a single paragraph.

هذه الفقرة تبدأ بالعربية ولكن تتضمن some English phrases ثم تعود إلى العربية. هذا يختبر قدرتنا على التعامل مع تغييرات النصوص.

The following is a list of mixed items:
* العنصر الأول باللغة العربية
* Second item in English
* العنصر الثالث يحتوي على English and العربية together
* Fourth item with numbers: 123 و ٤٥٦ و 789

أرقام مختلطة: 1234 و ٥٦٧٨ و 90 تظهر بشكل صحيح في مختلف السياقات.`;

/**
 * Arabic text with numbers
 */
export const arabicWithNumbers = `لدينا ١٢٣٤٥ وأيضًا 67890 كأمثلة على الأرقام.`;

/**
 * Longer Arabic sample text for testing multiline text
 */
export const arabicLongSample = `
هذا النص هو مثال للنص الذي يمكن أن يستبدل في نفس المساحة. 
لقد تم توليد هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى.
إذا كنت تحتاج إلى عدد أكبر من الفقرات، يولد مولد النص العربي نصوصًا عشوائية.
هذا مفيد عندما يريد المصمم عرض شكل الخط وتصميم الصفحة.
`;

/**
 * Arabic document sample with headings and structure
 */
export const arabicDocumentSample = `
# مستند للاختبار
## مقدمة
هذا مستند لاختبار دعم اللغة العربية واتجاه النص من اليمين إلى اليسار في التطبيق.

## المحتوى
1. هذه هي النقطة الأولى
2. وهذه هي النقطة الثانية
3. والثالثة أيضًا

## قائمة غير مرتبة
* عنصر من القائمة
* عنصر آخر
* عنصر ثالث

## نص مع تنسيق
هذا نص **غامق** وهذا نص *مائل* وهذا [رابط](https://example.com).

## دعم الرموز
يمكننا أيضًا إضافة رموز مثل: 😊 🌟 🚀

## خاتمة
شكرًا لاختبار دعم اللغة العربية في التطبيق!
`;

/**
 * Helper function to insert Arabic test content into an editor
 * @param editorFunction - The function to use to set content
 * @param contentType - Type of test content to insert
 */
export function insertArabicTestContent(
  editorFunction: (content: string) => void,
  contentType: 'short' | 'mixed' | 'numbers' | 'long' | 'document' = 'document'
): void {
  let content = '';
  
  switch (contentType) {
    case 'short':
      content = arabicShortSample;
      break;
    case 'mixed':
      content = arabicMixedSample;
      break;
    case 'numbers':
      content = arabicWithNumbers;
      break;
    case 'long':
      content = arabicLongSample;
      break;
    case 'document':
    default:
      content = arabicDocumentSample;
      break;
  }
  
  editorFunction(content);
}
