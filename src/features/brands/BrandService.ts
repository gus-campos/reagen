import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { PackageService } from '../package/services/PackageService';
import { Brand } from './brand';

const DOC_NAME = 'brands';

export class BrandService extends FirebaseBaseService<Brand> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: BrandService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new BrandService();
    return this._instance;
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedPackages(id);
    await super.delete(id);
  }

  private async deleteRelatedPackages(brandId: string) {
    const packages = await PackageService.instance.getAll(); // TODO: Poderia ser query
    const relatedPackages = packages.filter((p) => p.brandId === brandId);
    relatedPackages.forEach((pkg) => PackageService.instance.delete(pkg.id));
  }
}
