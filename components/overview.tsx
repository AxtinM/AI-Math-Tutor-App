import { motion } from 'framer-motion';
import Image from 'next/image';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl rtl-force" dir="rtl">
        <div className="flex justify-center">
          <Image 
            src="/images/math_tutor_logo.png" 
            alt="Math Tutor Logo" 
            width={120} 
            height={120} 
            className="rounded-full"
          />
        </div>
        
        <div className="font-dubai text-xl">
<p className="mb-4">
  هذا المساعد مخصص لمساعدة الطلاب في أداء واجباتهم المدرسية بطريقة ممتعة وتفاعلية.
</p>
<p>
  يمكنك طرح أي سؤال في الرياضيات، العلوم، التاريخ، الجغرافيا، اللغات والمزيد! يمكنك أيضًا التقاط صورة أو تحميل مستند للحصول على المساعدة.
</p>
        </div>
      </div>
    </motion.div>
  );
};
