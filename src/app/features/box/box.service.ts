import { BaseRepository, IDatabase } from '@core/services/base-repository.service';
import { Injectable } from '@angular/core';
import { Box } from './box.model';
import { DataTable } from '@shared/database/tables';

@Injectable({ providedIn: 'root' })
export class BoxRepository extends BaseRepository<Box> {
  constructor(db: IDatabase) {
    super(db, DataTable.Box);
  }
}
