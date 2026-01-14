import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { PackageService } from '@/features/package/package.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class SupplierService extends BaseRepository<Supplier> {
  private packageService?: PackageService;

  constructor(db: IDatabase) {
    super(db, DatabaseTableName.Supplier);
  }

  injectLate(packageService: PackageService) {
    this.packageService = packageService;
  }

  private checkLateInjection() {
    if (!this.packageService) throw new Error('packageService não injetado');
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedPackages(id);
    await super.delete(id);
  }

  private async deleteRelatedPackages(supplierId: string) {
    this.checkLateInjection();
    const packages = await this.packageService!.getAll();
    const relatedPkgs = packages.filter((p) => p.supplierId === supplierId);
    return Promise.all(relatedPkgs.map((p) => this.packageService!.delete(p.id)));
  }
}
