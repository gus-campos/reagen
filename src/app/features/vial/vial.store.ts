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

  async loadVials() {
    const vials = await this.handleAsync(() => firstValueFrom(this.vialRepository.getAll()));
    if (vials) this.setItems(vials);
  }

  async addVial(vial: OmitId<Vial>) {
    const newVial = await this.handleAsync(
      async () => await firstValueFrom(this.vialRepository.create(vial))
    );
    if (newVial) this.addItem(newVial);
  }

  removeVial(id: VialId) {
    this.removeItem(id);
    this.vialRepository.delete(id);
  }

  updateVial(id: VialId, data: Partial<OmitId<Vial>>) {
    this.updateItem(id, data);
    this.vialRepository.update(id, data);
  }

  getVialById(id: Signal<VialId>): Signal<Vial | undefined> {
    return this.getItemById(id);
  }
}
