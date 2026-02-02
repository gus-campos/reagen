import { FundingSource } from '@/features/named-option/funding-source/funding-source.type';
import { PackageService } from '@/features/package/package.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class FundingSourceService extends BaseRepository<FundingSource> {
  private packageService?: PackageService;

  constructor(db: IDatabase) {
    super(db, DatabaseTableName.FundingSource);
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
    const relatedPkgs = packages.filter((p) => p.fundingSourceId === brandId);
    return Promise.all(relatedPkgs.map((vial) => this.packageService!.delete(vial.id)));
  }
}
