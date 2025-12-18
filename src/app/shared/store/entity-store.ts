import { OmitId, WithId } from '@core/models/base.interface';
import { BaseStore } from './base-store';
import { EntityState } from './entity-state';
import { computed, Signal } from '@angular/core';

export abstract class EntityStore<T extends WithId> extends BaseStore<EntityState<T>> {
  /* Segue modelo de erro silecioso. Se o item a ser atualizado, ou removido, não é encontrado, nada 
  acontece, e etc. */

  protected constructor() {
    super({ items: [], loading: false, error: null });
  }

  readonly items = this.select((s) => s.items);
  readonly loading = this.select((s) => s.loading);
  readonly error = this.select((s) => s.error);

  // ───────── Helper async ─────────

  protected async handleAsync<T>(operation: () => Promise<T>): Promise<T | undefined> {
    this.setLoading(true);
    this.setError(null);

    try {
      return await operation();
    } catch (e) {
      this.setError(e instanceof Error ? e.message : String(e));
    } finally {
      this.setLoading(false);
    }

    return;
  }

  // ───────── Helpers CRUD ─────────

  protected async addItem(item: T) {
    this.updateState((s) => ({
      ...s,
      items: [...s.items, item],
    }));
  }

  protected removeItem(id: string) {
    this.updateState((s) => ({
      ...s,
      items: s.items.filter((item) => item.id !== id),
    }));
  }

  protected updateItem(id: string, data: Partial<OmitId<T>>) {
    this.updateState((state) => {
      return {
        ...state,
        items: state.items.map((item) => (item.id === id ? { ...item, ...data } : item)),
      };
    });
  }

  protected getItemById(id: Signal<string>): Signal<T | undefined> {
    return computed(() => {
      const item = this.snapshot().items.find((item) => item.id === id());
      return item;
    });
  }

  // ───────── Flags ─────────

  protected setItems(items: T[]) {
    this.patchState({ items });
  }

  protected setLoading(v: boolean) {
    this.patchState({ loading: v });
  }

  protected setError(e: string | null) {
    this.patchState({ error: e });
  }
}
