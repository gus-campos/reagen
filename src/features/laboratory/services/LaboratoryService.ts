import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { Laboratory } from '../types/laboratory';

const DOC_NAME = 'laboratory';

export class LaboratoryService extends FirebaseBaseService<Laboratory> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: LaboratoryService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new LaboratoryService();
    return this._instance;
  }

  // private async deleteRelatedItems(controlAgencyId: string) {
  //   const items = await ItemService.instance.getAll(); // TODO: Poderia ser query
  //   const relatedItems = items.filter((i) => i.controlAgencyId === controlAgencyId);
  //   await Promise.all(relatedItems.map((reagent) => ReagentService.instance.delete(reagent.id)));
  // }
}
