import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { ReagentService } from '../../reagent/services/ReagentService';
import { ControlAgency } from '../types/control-agency';

const DOC_NAME = 'control-agencies';

export class ControlAgencyService extends FirebaseBaseService<ControlAgency> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: ControlAgencyService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new ControlAgencyService();
    return this._instance;
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedReagents(id);
    super.delete(id);
  }

  private async deleteRelatedReagents(controlAgencyId: string) {
    const reagents = await ReagentService.instance.getAll();
    const relatedReagents = reagents.filter((r) => r.controlAgencyId === controlAgencyId);
    await Promise.all(relatedReagents.map((reagent) => ReagentService.instance.delete(reagent.id)));
  }
}
