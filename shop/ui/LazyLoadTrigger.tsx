import { useEffect, useRef, useState } from 'react';

interface LazyLoadTriggerProps {
  onIntersect: () => void;
  enabled?: boolean;
}

export function LazyLoadTrigger({ onIntersect, enabled = true }: LazyLoadTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!enabled || hasIntersected) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasIntersected(true);
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    const current = triggerRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [enabled, hasIntersected, onIntersect]);

  if (!enabled || hasIntersected) return null;

  return <div ref={triggerRef} className="h-1 w-full" />;
}
