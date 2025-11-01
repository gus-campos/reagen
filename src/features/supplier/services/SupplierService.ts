import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { ItemService } from '../../items/services/ItemService';
import { Supplier } from '../types/supplier';

const DOC_NAME = 'supplier';

export class SupplierService extends FirebaseBaseService<Supplier> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: SupplierService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new SupplierService();
    return this._instance;
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedItems(id);
    await super.delete(id);
  }

  private async deleteRelatedItems(supplierId: string) {
    const items = await ItemService.instance.getAll(); // TODO: Poderia ser query
    const relatedItems = items.filter((i) => i.supplierId === supplierId);
    relatedItems.forEach((item) => ItemService.instance.delete(item.id));
  }
}
