import { Vial } from '@/features/vial/vial.type';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class VialService extends BaseRepository<Vial> {
  constructor(db: IDatabase) {
    super(db, DatabaseTableName.Vial);
  }
}
