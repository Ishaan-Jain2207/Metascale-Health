/**
 * METASCALE HEALTH: CLINICAL REACTIVE ENGINE (healthService.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This service acts as the 'Reactive Intelligence Core' of the frontend. 
 * it manages the diagnostic state using RxJS—a powerful library for 
 * asynchronous data streams.
 * 
 * ─── REACTIVE STREAM ARCHITECTURE (RxJS) ────────────────────────────────────
 * Unlike standard React state, we utilize 'BehaviorSubject' for:
 *   1. PERSISTENCE: Maintains the last emitted value for new subscribers, 
 *      ensuring dashboard components have immediate access to data on mount.
 *   2. DECOUPLING: Separates the 'Business Logic' of diagnostic fetching 
 *      from the 'UI logic' of the React components.
 *   3. OBSERVABILITY: Components subscribe to the 'predictions$' stream, 
 *      reacting only when relevant data arrives.
 * 
 * ─── CLINICAL SYNCHRONIZATION ───────────────────────────────────────────────
 *   - runScreening: Orchestrates the request to the metabolic engines.
 *   - fetchHistory: Synchronizes the local state with the patient's 
 *     Universal Clinical Record (UCR) on the backend.
 */

import { BehaviorSubject } from 'rxjs';
import api from './api';

class HealthService {
  /**
   * SERVICE BOOTSTRAP
   * Logic: Initializes the 'Diagnostic Stream' with a baseline schema.
   * State: { loading, liver, diabetes, error, history }
   */
  constructor() {
    this.predictionsSubject = new BehaviorSubject({
      loading: false,
      liver: null,
      diabetes: null,
      error: null,
      history: []
    });

    // PUBLIC STREAM: Components subscribe to this observable.
    this.predictions$ = this.predictionsSubject.asObservable();
  }

  // SNAPSHOT HELPER: Returns the synchronous value of the stream.
  get currentPredictions() {
    return this.predictionsSubject.getValue();
  }

  /**
   * DIAGNOSTIC PROTOCOL: runScreening
   * 
   * Logic:
   *   - Lifecycle: Emits 'loading: true' -> API Request -> Emits 'Result' or 'Error'.
   *   - Parity: Correctly maps 'liver' or 'diabetes' requests to the Prediction API.
   */
  async runScreening(type, data) {
    this.updateState({ loading: true, error: null });
    try {
      const endpoint = type === 'liver' ? '/predict/liver' : '/predict/diabetes';
      const response = await api.post(endpoint, data);
      
      const updatedPredictions = { ...this.currentPredictions };
      updatedPredictions[type] = response.data;
      updatedPredictions.loading = false;
      
      // EMISSION: Push the updated diagnostic set to all subscribers.
      this.predictionsSubject.next(updatedPredictions);
      return response.data;
    } catch (err) {
      this.updateState({ 
        loading: false, 
        error: err.response?.data?.message || 'Metabolic diagnostic sequence failed.' 
      });
      throw err;
    }
  }

  /**
   * ARCHIVE SYNCHRONIZATION: fetchHistory
   * 
   * Logic:
   *   - Purpose: Updates the 'history' array in the global stream.
   *   - Used by: Longitudinal audit tables and trend charts.
   */
  async fetchHistory() {
    try {
      const response = await api.get('/predict/history');
      this.updateState({ history: response.data.data });
    } catch (err) {
      console.error('[SYNC FAULT] Diagnostic archive retrieval interrupted.', err);
    }
  }

  /**
   * INTERNAL: ATOMIC STATE UPDATE
   * Logic: Shallow-merges the next state into the BehaviorSubject.
   */
  updateState(newState) {
    this.predictionsSubject.next({
      ...this.currentPredictions,
      ...newState
    });
  }
}

// PERSISTENT SINGLETON: The application uses a single instance to maintain state parity.
export const healthService = new HealthService();
export default healthService;



