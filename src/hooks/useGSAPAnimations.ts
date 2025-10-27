import { useRef, useEffect } from 'react';

export const useGSAPAnimations = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const followUsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load GSAP dynamically to avoid SSR issues
    const loadAnimations = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero button animation
        if (heroRef.current) {
          const heroButton = heroRef.current.querySelector('.hero-button');
          if (heroButton) {
            gsap.fromTo(heroButton, 
              { opacity: 0, y: 50, scale: 0.8 },
              { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.7)", delay: 0.5 }
            );

            heroButton.addEventListener('mouseenter', () => {
              gsap.to(heroButton, { scale: 1.05, duration: 0.3, ease: "power2.out" });
            });

            heroButton.addEventListener('mouseleave', () => {
              gsap.to(heroButton, { scale: 1, duration: 0.3, ease: "power2.out" });
            });
          }
        }

        // Best Sellers animations
        if (bestSellersRef.current) {
          const cards = bestSellersRef.current.querySelectorAll('.product-card');
          gsap.fromTo(cards,
            { opacity: 0, y: 100, rotationX: 15 },
            {
              opacity: 1, y: 0, rotationX: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
              scrollTrigger: {
                trigger: bestSellersRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );

          cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
              gsap.to(card, { y: -10, scale: 1.02, duration: 0.3, ease: "power2.out" });
            });
            card.addEventListener('mouseleave', () => {
              gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
            });
          });
        }

        // Collection animations
        if (collectionRef.current) {
          const collectionCards = collectionRef.current.querySelectorAll('.collection-card');
          gsap.fromTo(collectionCards,
            { opacity: 0, scale: 0.8, rotation: 5 },
            {
              opacity: 1, scale: 1, rotation: 0, duration: 1, stagger: 0.15, ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: collectionRef.current,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
              }
            }
          );

          collectionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
              gsap.to(card, { scale: 1.05, rotation: 2, duration: 0.4, ease: "power2.out" });
            });
            card.addEventListener('mouseleave', () => {
              gsap.to(card, { scale: 1, rotation: 0, duration: 0.4, ease: "power2.out" });
            });
          });
        }

        // Follow Us animations
        if (followUsRef.current) {
          const followCards = followUsRef.current.querySelectorAll('.follow-card');
          gsap.fromTo(followCards,
            { opacity: 0, y: 80, rotationY: 20 },
            {
              opacity: 1, y: 0, rotationY: 0, duration: 0.9, stagger: 0.1, ease: "power2.out",
              scrollTrigger: {
                trigger: followUsRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );

          followCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
              gsap.to(card, { scale: 1.08, rotationY: 5, duration: 0.3, ease: "power2.out" });
            });
            card.addEventListener('mouseleave', () => {
              gsap.to(card, { scale: 1, rotationY: 0, duration: 0.3, ease: "power2.out" });
            });
          });
        }

      } catch (error) {
        console.error('Error loading GSAP animations:', error);
      }
    };

    loadAnimations();

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        });
      }
    };
  }, []);

  return {
    heroRef,
    bestSellersRef,
    collectionRef,
    followUsRef
  };
};