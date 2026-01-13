import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DbTableName } from '@/shared/types/table-name.type';

export class ControlAgencyService extends BaseRepository<ControlAgency> {
  public constructor(
    db: IDatabase,
    private reagentService: ReagentService
  ) {
    super(db, DbTableName.ControlAgency);
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedReagents(id);
    super.delete(id);
  }

  private async deleteRelatedReagents(controlAgencyId: string) {
    const reagents = await this.reagentService.getAll();
    const relatedReagents = reagents.filter((r) => r.controlAgencyId === controlAgencyId);
    await Promise.all(relatedReagents.map((reagent) => this.reagentService.delete(reagent.id)));
  }
}
