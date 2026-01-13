import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { PackageService } from '../../package/services/PackageService';
import { Brand } from '../types/brand';

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
    const packages = await PackageService.instance.getAll();
    const relatedPkgs = packages.filter((p) => p.brandId === brandId);
    relatedPkgs.forEach((vial) => PackageService.instance.delete(vial.id));
  }
}
