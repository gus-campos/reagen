import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { VialService } from '../vials/services/VialService';
import { Supplier } from './supplier';

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
    await this.deleteRelatedVials(id);
    await super.delete(id);
  }

  private async deleteRelatedVials(supplierId: string) {
    const vials = await VialService.instance.getAll(); // TODO: Poderia ser query
    const relatedVials = vials.filter((i) => i.supplierId === supplierId);
    relatedVials.forEach((vial) => VialService.instance.delete(vial.id));
  }
}
