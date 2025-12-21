import { Injectable } from '@angular/core';
import { BaseRepository, IDatabase } from '@core/services/base-repository.service';
import { DataTable } from '@shared/database/tables';
import { Reagent } from './reagent.model';

@Injectable({ providedIn: 'root' })
export class ReagentRepository extends BaseRepository<Reagent> {
  constructor(db: IDatabase) {
    super(db, DataTable.Reagent);
  }
}
