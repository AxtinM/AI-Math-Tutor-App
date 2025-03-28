'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DecorativePattern() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-30">
      {/* Top-left decorative corner */}
      <div className="absolute top-0 left-0 size-64">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L100 0L100 100L0 0Z"
            fill={isDark ? "hsl(var(--primary) / 20%)" : "hsl(var(--primary) / 10%)"}
          />
          <path
            d="M20 0L80 0L80 60L20 0Z"
            fill={isDark ? "hsl(var(--accent) / 15%)" : "hsl(var(--accent) / 8%)"}
          />
          <circle cx="50" cy="30" r="10" fill={isDark ? "hsl(var(--primary) / 15%)" : "hsl(var(--primary) / 7%)"} />
          <path
            d="M0 20C0 8.95 8.95 0 20 0L60 0C71.05 0 80 8.95 80 20L0 20Z"
            fill={isDark ? "hsl(var(--primary) / 10%)" : "hsl(var(--primary) / 5%)"}
          />
        </svg>
      </div>

      {/* Bottom-right decorative corner */}
      <div className="absolute bottom-0 right-0 size-64 rotate-180">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L100 0L100 100L0 0Z"
            fill={isDark ? "hsl(var(--primary) / 20%)" : "hsl(var(--primary) / 10%)"}
          />
          <path
            d="M20 0L80 0L80 60L20 0Z"
            fill={isDark ? "hsl(var(--accent) / 15%)" : "hsl(var(--accent) / 8%)"}
          />
          <circle cx="50" cy="30" r="10" fill={isDark ? "hsl(var(--primary) / 15%)" : "hsl(var(--primary) / 7%)"} />
          <path
            d="M0 20C0 8.95 8.95 0 20 0L60 0C71.05 0 80 8.95 80 20L0 20Z"
            fill={isDark ? "hsl(var(--primary) / 10%)" : "hsl(var(--primary) / 5%)"}
          />
        </svg>
      </div>

      {/* Islamic geometric pattern - entire background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <pattern id="arabicPattern" patternUnits="userSpaceOnUse" width="50" height="50" viewBox="0 0 50 50">
            <path d="M0,25 L25,0 L50,25 L25,50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0,0 L50,50 M50,0 L0,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="25" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M15,15 L35,15 L35,35 L15,35 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="25" cy="25" r="5" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M25,0 L25,50 M0,25 L50,25" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#arabicPattern)" />
        </svg>
      </div>

      {/* Math symbols scattered around */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <text x="10" y="20" fill="currentColor" className="text-3xl">+</text>
          <text x="30" y="40" fill="currentColor" className="text-3xl">-</text>
          <text x="50" y="80" fill="currentColor" className="text-3xl">×</text>
          <text x="70" y="60" fill="currentColor" className="text-3xl">÷</text>
          <text x="90" y="30" fill="currentColor" className="text-3xl">=</text>
          <text x="20" y="70" fill="currentColor" className="text-3xl">%</text>
          <text x="60" y="10" fill="currentColor" className="text-3xl">π</text>
        </svg>
      </div>
    </div>
  );
}
