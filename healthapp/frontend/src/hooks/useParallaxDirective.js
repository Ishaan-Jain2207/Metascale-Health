/**
 * USE PARALLAX DIRECTIVE (Aesthetic Motion Hook)
 * Purpose: Mimics an 'Angular Directive' by attaching low-level 3D motion to a target DOM node.
 * Logic: 
 *   - Subscribes to global mouse movements.
 *   - Computes a displacement vector relative to the viewport center.
 *   - Injects normalized 'perspective' and 'rotate' CSS transforms directly into the element style.
 */
import { useEffect } from 'react';

/**
 * @param {RefObject} ref — The target clinical UI component.
 * @param {number} factor — Sensitivity multiplier (Inverse influence).
 */
export function useParallaxDirective(ref, factor = 20) {
  useEffect(() => {
    // GUARD: Ensure the element is mounted before attaching listeners.
    if (!ref.current) return;

    const el = ref.current;

    /**
     * VECTOR COMPUTATION
     * Logic: Maps screen coordinates [0, Width] to rotation degrees [-Deg, +Deg].
     */
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / factor;
      const y = (e.clientY - innerHeight / 2) / factor;

      // 3D TRANSFORM: Creates a premium 'Depth' effect common in modern clinical consoles.
      el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    // EVENT BINDING: Track movement across the entire document.
    window.addEventListener('mousemove', handleMouseMove);
    
    // TEAR DOWN: Clean up listener to maintain high framerate performance.
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref, factor]);
}

export default useParallaxDirective;

