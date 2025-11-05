import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { ItemService } from '../../items/services/ItemService';
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

  public async delete(id: string): Promise<void> {
    await this.deleteRelatedItems(id);
    await super.delete(id);
  }

  private async deleteRelatedItems(laboratoryId: string) {
    const items = await ItemService.instance.getAll(); // TODO: Poderia ser query
    const relatedItems = items.filter((i) => i.laboratoryId === laboratoryId);
    await Promise.all(relatedItems.map((i) => ItemService.instance.delete(i.id)));
  }
}
