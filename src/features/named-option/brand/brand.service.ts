import { Brand } from '@/features/named-option/brand/brand.type';
import { PackageService } from '@/features/package/package.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class BrandService extends BaseRepository<Brand> {
  private packageService?: PackageService;

  constructor(db: IDatabase) {
    super(db, DatabaseTableName.Brand);
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

  private async deleteRelatedPackages(brandId: string) {
    this.checkLateInjection();
    const packages = await this.packageService!.getAll();
    const relatedPkgs = packages.filter((p) => p.brandId === brandId);
    return Promise.all(relatedPkgs.map((vial) => this.packageService!.delete(vial.id)));
  }
}
