import { useEffect, useState } from 'react';

type ResolvedTheme = 'light' | 'dark';

function getResolvedTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const root = window.document.documentElement;
  if (root.classList.contains('dark')) {
    return 'dark';
  }
  if (root.classList.contains('light')) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useResolvedTheme(): ResolvedTheme {
  const [theme, setTheme] = useState<ResolvedTheme>(() => getResolvedTheme());

  useEffect(() => {
    const updateTheme = () => setTheme(getResolvedTheme());
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const observer = new MutationObserver(updateTheme);

    mediaQuery.addEventListener('change', updateTheme);
    observer.observe(window.document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    updateTheme();

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
      observer.disconnect();
    };
  }, []);

  return theme;
}
