import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

/**
 * Mock implementation of NgRx Store for testing
 * This provides a simplified mock of the Store that can be used in tests
 */
@Injectable()
export class StoreMock {
  private state = new BehaviorSubject<any>({
    task: {
      tasks: [],
      selectedTask: null,
      loading: new Set<string>([]),
      error: null,
      sort: null,
      filter: null,
      search: null,
    }
  });

  /**
   * Mock implementation of select method
   * @param selector - The selector function or string path
   * @returns An observable of the selected state
   */
  select(selector: any): Observable<any> {
    // If selector is a function, apply it to the current state
    if (typeof selector === 'function') {
      return of(selector(this.state.value));
    }
    
    // Otherwise, return the whole state
    return of(null);
  }

  /**
   * Mock implementation of dispatch method
   * @param action - The action to dispatch
   * @returns The action
   */
  dispatch(action: any): any {
    return action;
  }
}