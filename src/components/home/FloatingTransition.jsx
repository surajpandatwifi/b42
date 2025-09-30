import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { FloatingPathsBackground } from '../ui/floating-paths';

const FloatingTransition = () => {
  const sectionRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(-1);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      const topInView = rect.top;
      const bottomInView = rect.bottom;

      if (bottomInView > 0 && topInView < windowHeight) {
        const scrollProgress = Math.max(0, Math.min(1,
          (windowHeight - topInView) / (windowHeight + sectionHeight)
        ));

        setScrollPosition(-1 + scrollProgress * 2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      '.floating-transition',
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden floating-transition"
      style={{
        minHeight: 'clamp(300px, 50vh, 600px)',
      }}
    >
      <div className="absolute inset-0 bg-black/95">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>

      <FloatingPathsBackground
        className="w-full h-full flex items-center justify-center"
        position={scrollPosition}
      >
        <div className="relative z-10 opacity-0" />
      </FloatingPathsBackground>

      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.95) 100%)',
        }}
      />
    </section>
  );
};

export default FloatingTransition;
