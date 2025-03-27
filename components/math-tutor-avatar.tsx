'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function MathTutorAvatar({ size = 40 }: { size?: number }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ width: size, height: size }}>
      <Image
            src="/images/homework_assistant_logo.png"
            alt="مساعد الواجبات المنزلية Logo"
        width={size}
        height={size}
        className="object-contain rounded-full"
        priority
      />
    </div>
  );
}
