import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { VialService } from '@/features/vial/vial.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DbTableName } from '@/shared/types/table-name.type';

export class LaboratoryService extends BaseRepository<Laboratory> {
  public constructor(
    db: IDatabase,
    private vialService: VialService
  ) {
    super(db, DbTableName.Laboratory);
  }

  public async delete(id: string): Promise<void> {
    await this.deleteRelatedVials(id);
    await super.delete(id);
  }

  private async deleteRelatedVials(laboratoryId: string) {
    const vials = await this.vialService.getAll();
    const relatedVials = vials.filter((vial) => vial.laboratoryId === laboratoryId);
    await Promise.all(relatedVials.map((vial) => this.vialService.delete(vial.id)));
  }
}
