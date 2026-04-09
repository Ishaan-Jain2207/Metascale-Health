/**
 * USE SERVICE (Reactive Subscription Hook)
 * Purpose: Bridges the gap between static React state and Angular-style RxJS Observables.
 * Logic: 
 *   - Subscribes to an observable vector and synchronizes its stream with local state.
 *   - Implements 'Defensive Initialization' to handle undefined observables during SSR or hydration.
 *   - Enforces the 'Unsubscribe' pattern to prevent memory leaks in high-frequency clinical dashboards.
 */
import { useState, useEffect } from 'react';

export function useService(observable) {
  // INITIAL STATE HYDRATION
  // Logic: Attempts to pull the 'Current Value' from a BehaviorSubject if available.
  const [value, setValue] = useState(() => {
    if (!observable) return null;
    return 'getValue' in observable ? observable.getValue() : null;
  });

  useEffect(() => {
    // SECURITY GUARD: Ensure the target adheres to the Observable interface.
    if (!observable || typeof observable.subscribe !== 'function') {
      return;
    }

    // STREAM SUBSCRIPTION: Listen for real-time mutations in the underlying service.
    const subscription = observable.subscribe(
      (val) => setValue(val),
      (err) => console.error('[DATA FAULT] Service Subscription Interrupted:', err)
    );

    // CLEANUP: Tear down the subscription when the component unmounts from the DOM.
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}

export default useService;

