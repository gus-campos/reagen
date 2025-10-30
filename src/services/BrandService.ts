import { Brand } from '../models/brand';
import { FirebaseBaseService } from './base/FirebaseBaseService';
import { ItemService } from './ItemService';

const DOC_NAME = 'brands';

export class BrandService extends FirebaseBaseService<Brand> {
  constructor() {
    super(DOC_NAME);
  }

  private static _instance: BrandService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new BrandService();
    return this._instance;
  }

  async delete(id: string): Promise<void> {
    await super.delete(id);
    await this.deleteRelatedItems(id);
  }

  private async deleteRelatedItems(brandId: string) {
    const items = await ItemService.instance.getAll(); // TODO: Poderia ser query
    const relatedItems = items.filter((i) => i.brandId === brandId);
    relatedItems.forEach((item) => ItemService.instance.delete(item.id));
  }
}
