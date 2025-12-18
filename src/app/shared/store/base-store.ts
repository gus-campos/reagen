import { signal, WritableSignal, Signal, computed } from '@angular/core';

export abstract class BaseStore<T> {
  protected readonly _state: WritableSignal<T>;
  readonly state: Signal<T>;

  protected constructor(initial: T) {
    this._state = signal(initial);
    this.state = this._state.asReadonly();
  }

  /* Leitura */

  protected select<K>(selector: (state: T) => K): Signal<K> {
    return computed(() => selector(this._state()));
  }

  protected snapshot(): T {
    return this._state();
  }

  /* Escrita */

  protected patchState(patch: Partial<T>) {
    this._state.update((s) => ({ ...s, ...patch }));
  }

  protected updateState(updater: (state: T) => T) {
    this._state.update(updater);
  }

  // protected reset(initial: T) {
  //   this._state.set(initial);
  // }
}
