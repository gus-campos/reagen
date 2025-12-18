import { EntityStore } from '@shared/store/entity-store';
import { firstValueFrom } from 'rxjs';
import { Injectable, Signal } from '@angular/core';
import { OmitId } from '@core/models/base.interface';
import { Box, BoxId } from './box.model';
import { BoxRepository } from './box.service';

@Injectable({ providedIn: 'root' })
export class BoxStore extends EntityStore<Box> {
  constructor(private boxRepository: BoxRepository) {
    super();
  }

  readonly boxes = this.select((s) => s.items);

  async load() {
    const boxes = await this.handleAsync(() => firstValueFrom(this.boxRepository.getAll()));
    if (boxes) this.setItems(boxes);
  }

  async add(box: OmitId<Box>) {
    const newBox = await this.handleAsync(
      async () => await firstValueFrom(this.boxRepository.create(box))
    );
    if (newBox) this.addItem(newBox);
  }

  remove(id: BoxId) {
    this.removeItem(id);
    this.boxRepository.delete(id);
  }

  update(id: BoxId, data: Partial<OmitId<Box>>) {
    this.updateItem(id, data);
    this.boxRepository.update(id, data);
  }

  getById(id: Signal<BoxId>): Signal<Box | undefined> {
    return this.getItemById(id);
  }
}
