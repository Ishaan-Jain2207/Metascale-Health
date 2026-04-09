/**
 * USE RIPPLE (Tactile Feedback Hook)
 * Purpose: Implements the 'Material' signature ripple effect for interactive components.
 * Logic: 
 *   - Captures client-relative click coordinates.
 *   - Normalizes coordinates against the element boundaries to center the ripple.
 *   - Manages a temporary list of ripple objects that self-destruct upon animation completion.
 */
import { useState, useLayoutEffect } from 'react';

export const useRipple = (ref) => {
  const [ripples, setRipples] = useState([]);

  // BINDING LIFECYCLE: Attaches click listeners directly to the target DOM node.
  useLayoutEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    /**
     * RIPPLE INITIALIZATION
     * Logic: Calculates the 'Expansion Center' based on the precise click vector.
     */
    const showRipple = (e) => {
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = {
        x,
        y,
        size,
        id: Date.now()
      };

      // IMMUTABLE UPDATE: Append the new ripple vector to the state stream.
      setRipples((prev) => [...prev, newRipple]);
    };

    element.addEventListener('mousedown', showRipple);
    return () => element.removeEventListener('mousedown', showRipple);
  }, [ref]);

  /**
   * RIPPLE LAYER (UI)
   * Logic: Maps the ripple state into a collection of transient <span> elements.
   */
  return ripples.map((ripple) => (
    <span
      key={ripple.id}
      style={{
        position: 'absolute',
        left: ripple.x,
        top: ripple.y,
        width: ripple.size,
        height: ripple.size,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple 600ms linear',
        pointerEvents: 'none'
      }}
      // SELF-DESTRUCTION: Removes the ripple from state once the visual cycle completes.
      onAnimationEnd={() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }}
    />
  ));
};

export default useRipple;

