import { Injectable } from '@angular/core';
import { BaseRepository, IDatabase } from '@core/services/base-repository.service';
import { Vial } from './vial.model';

@Injectable({ providedIn: 'root' })
export class VialService extends BaseRepository<Vial> {
  constructor(db: IDatabase) {
    super(db, 'vials');
  }

  protected override generateId(): string {
    return '0';
  }
}
