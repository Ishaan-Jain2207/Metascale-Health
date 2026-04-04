import { BehaviorSubject } from 'rxjs';
import api from './api';

/**
 * HealthService — Angular-style Service for Healthcare Logic
 * Uses RxJS BehaviorSubject to provide a "Stream" of health data.
 * Appropriately separates logic from the React UI components.
 */
class HealthService {
  // Observables for reactive state management
  predictionsSubject = new BehaviorSubject({
    loading: false,
    liver: null,
    diabetes: null,
    error: null,
    history: []
  });

  predictions$ = this.predictionsSubject.asObservable();

  // Current value getter for non-reactive access
  get currentPredictions() {
    return this.predictionsSubject.getValue();
  }

  /**
   * Run a new risk screening and stream the results.
   * This is a "Service Method" that components can call.
   */
  async runScreening(type, data) {
    this.updateState({ loading: true, error: null });

    try {
      const endpoint = type === 'liver' ? '/predictions/liver' : '/predictions/diabetes';
      const response = await api.post(endpoint, data);
      
      const updatedPredictions = { ...this.currentPredictions };
      updatedPredictions[type] = response.data;
      updatedPredictions.loading = false;
      
      this.predictionsSubject.next(updatedPredictions);
      return response.data;
    } catch (err) {
      this.updateState({ 
        loading: false, 
        error: err.response?.data?.message || 'Prediction failed' 
      });
      throw err;
    }
  }

  /**
   * Fetch prediction history and update the stream.
   */
  async fetchHistory() {
    try {
      const response = await api.get('/predictions/history');
      this.updateState({ history: response.data });
    } catch (err) {
      console.error('History fetch failed', err);
    }
  }

  // Internal helper to update behavior subject state
  updateState(newState) {
    this.predictionsSubject.next({
      ...this.currentPredictions,
      ...newState
    });
  }
}

// Singleton instance export (Angular-style providedIn: 'root')
export const healthService = new HealthService();
export default healthService;
