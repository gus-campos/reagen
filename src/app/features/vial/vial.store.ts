import { EntityStore } from '@shared/store/entity-store';
import { Vial, VialId } from './vial.model';
import { VialRepository } from './vial.service';
import { firstValueFrom } from 'rxjs';
import { Injectable, Signal } from '@angular/core';
import { OmitId } from '@core/models/base.interface';

@Injectable({ providedIn: 'root' })
export class VialStore extends EntityStore<Vial> {
  constructor(private vialRepository: VialRepository) {
    super();
  }

  readonly vials = this.select((s) => s.items);

  async load() {
    const vials = await this.handleAsync(() => firstValueFrom(this.vialRepository.getAll()));
    if (vials) this.setItems(vials);
  }

  async add(vial: OmitId<Vial>) {
    const newVial = await this.handleAsync(
      async () => await firstValueFrom(this.vialRepository.create(vial))
    );
    if (newVial) this.addItem(newVial);
  }

  remove(id: VialId) {
    this.removeItem(id);
    this.vialRepository.delete(id);
  }

  update(id: VialId, data: Partial<OmitId<Vial>>) {
    this.updateItem(id, data);
    this.vialRepository.update(id, data);
  }

  getById(id: Signal<VialId>): Signal<Vial | undefined> {
    return this.getItemById(id);
  }
}
