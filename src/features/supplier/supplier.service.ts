import { PackageService } from '@/features/package/package.service';
import { Supplier } from '@/features/supplier/supplier.type';
import { FirebaseBaseService } from '@/shared/services/firabse-base.service';

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
    await this.deleteRelatedPackages(id);
    await super.delete(id);
  }

  private async deleteRelatedPackages(supplierId: string) {
    const packages = await PackageService.instance.getAll();
    const relatedPkgs = packages.filter((p) => p.supplierId === supplierId);
    relatedPkgs.forEach((p) => PackageService.instance.delete(p.id));
  }
}
