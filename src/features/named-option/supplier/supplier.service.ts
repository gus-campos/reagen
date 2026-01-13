import { Supplier } from '@/features/named-option/supplier/supplier.type';
import { PackageService } from '@/features/package/package.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DbTableName } from '@/shared/types/table-name.type';

export class SupplierService extends BaseRepository<Supplier> {
  public constructor(
    db: IDatabase,
    private packageService: PackageService
  ) {
    super(db, DbTableName.Supplier);
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedPackages(id);
    await super.delete(id);
  }

  private async deleteRelatedPackages(supplierId: string) {
    const packages = await this.packageService.getAll();
    const relatedPkgs = packages.filter((p) => p.supplierId === supplierId);
    relatedPkgs.forEach((p) => this.packageService.delete(p.id));
  }
}
