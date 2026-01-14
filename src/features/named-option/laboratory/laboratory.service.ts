import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { VialService } from '@/features/vial/vial.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class LaboratoryService extends BaseRepository<Laboratory> {
  private vialService?: VialService;

  constructor(db: IDatabase) {
    super(db, DatabaseTableName.Laboratory);
  }

  injectLate(vialService: VialService) {
    this.vialService = vialService;
  }

  private checkLateInjection() {
    if (!this.vialService) throw new Error('vialService não injetado');
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedVials(id);
    await super.delete(id);
  }

  private async deleteRelatedVials(laboratoryId: string) {
    this.checkLateInjection();
    const vials = await this.vialService!.getAll();
    const relatedVials = vials.filter((vial) => vial.laboratoryId === laboratoryId);
    await Promise.all(relatedVials.map((vial) => this.vialService!.delete(vial.id)));
  }
}
