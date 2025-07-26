import { useEffect, useRef, useState } from 'react';

interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(options: IntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && options.triggerOnce && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px',
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [options.threshold, options.rootMargin, options.triggerOnce, hasTriggered]);

  return [targetRef, isIntersecting, hasTriggered] as const;
}