import { EntityStore } from '@shared/store/entity-store';
import { Reagent, ReagentId } from './reagent.model';
import { Injectable, Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ReagentRepository } from './reagent.service';
import { OmitId } from '@core/models/base.interface';

@Injectable({ providedIn: 'root' })
export class ReagentStore extends EntityStore<Reagent> {
  constructor(private reagentRepository: ReagentRepository) {
    super();
  }

  readonly reagents = this.select((s) => s.items);

  async load() {
    const reagents = await this.handleAsync(() => firstValueFrom(this.reagentRepository.getAll()));
    if (reagents) this.setItems(reagents);
  }

  async add(vial: OmitId<Reagent>) {
    const newReagent = await this.handleAsync(
      async () => await firstValueFrom(this.reagentRepository.create(vial))
    );
    if (newReagent) this.addItem(newReagent);
  }

  remove(id: ReagentId) {
    this.removeItem(id);
    this.reagentRepository.delete(id);
  }

  update(id: ReagentId, data: Partial<OmitId<Reagent>>) {
    this.updateItem(id, data);
    this.reagentRepository.update(id, data);
  }

  getById(id: Signal<ReagentId>): Signal<Reagent | undefined> {
    return this.getItemById(id);
  }
}
