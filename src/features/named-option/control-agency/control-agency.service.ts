import { ControlAgency } from '@/features/named-option/control-agency/control-agency.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class ControlAgencyService extends BaseRepository<ControlAgency> {
  private reagentService?: ReagentService;

  constructor(db: IDatabase) {
    super(db, DatabaseTableName.ControlAgency);
  }

  injectLate(reagentService: ReagentService) {
    this.reagentService = reagentService;
  }

  private checkLateInjection() {
    if (!this.reagentService) throw new Error('reagentService não injetado');
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedReagents(id);
    await super.delete(id);
  }

  private async deleteRelatedReagents(controlAgencyId: string) {
    this.checkLateInjection();
    const reagents = await this.reagentService!.getAll();
    const relatedReagents = reagents.filter((r) => r.controlAgencyId === controlAgencyId);
    await Promise.all(relatedReagents.map((reagent) => this.reagentService!.delete(reagent.id)));
  }
}
