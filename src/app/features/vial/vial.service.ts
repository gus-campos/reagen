import { BaseRepository, IDatabase } from '@core/services/base-repository.service';
import { Vial } from './vial.model';
import { Injectable } from '@angular/core';
import { DataTable } from '@shared/database/tables';

@Injectable({ providedIn: 'root' })
export class VialRepository extends BaseRepository<Vial> {
  constructor(db: IDatabase) {
    super(db, DataTable.Vial);
  }
}
