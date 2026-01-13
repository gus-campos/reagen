import { Brand } from '@/features/named-option/brand/brand.type';
import { PackageService } from '@/features/package/package.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DbTableName } from '@/shared/types/table-name.type';

export class BrandService extends BaseRepository<Brand> {
  public constructor(
    db: IDatabase,
    private packageService: PackageService
  ) {
    super(db, DbTableName.Brand);
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedPackages(id);
    await super.delete(id);
  }

  private async deleteRelatedPackages(brandId: string) {
    const packages = await this.packageService.getAll();
    const relatedPkgs = packages.filter((p) => p.brandId === brandId);
    relatedPkgs.forEach((vial) => this.packageService.delete(vial.id));
  }
}
