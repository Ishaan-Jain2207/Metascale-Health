import { useState, useEffect } from 'react';

/**
 * useService — Custom hook to subscribe to an Angular-style RxJS Service.
 * Appropriately bridges the gap between Observables and React State.
 * This is the modern React version of an Angular subscription.
 *
 * @param {Observable} observable — The $ stream from the service.
 * @returns {any} value — The latest value emitted by the service.
 */
export function useService(observable) {
  const [value, setValue] = useState(() => {
    // Attempt to get initial value if it's a BehaviorSubject
    return 'getValue' in observable ? observable.getValue() : null;
  });

  useEffect(() => {
    const subscription = observable.subscribe(
      (val) => setValue(val),
      (err) => console.error('Service subscription error:', err)
    );

    // Unsubscribe on unmount (essential cleanup)
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}

export default useService;
