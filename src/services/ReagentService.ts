import { Reagent } from '../models/reagent';
import { Size } from '../models/size';
import { areSizesEqual } from '../utils/size';
import { FirebaseBaseService } from './base/FirebaseBaseService';
import { WithoutId } from './base/IDataService';
import { ItemService } from './ItemService';

const DOC_NAME = 'reagents';

export class ReagentService extends FirebaseBaseService<Reagent> {
  constructor() {
    super(DOC_NAME);
  }

  private static _instance: ReagentService | null = null;

  public static get instance() {
    if (!this._instance) this._instance = new ReagentService();
    return this._instance;
  }

  async delete(id: string): Promise<void> {
    // Deve ser feito nessa ordem, pois ao deleter o item, o reagente é obtido para
    // remover referências
    await this.deleteRelatedItems(id);
    await super.delete(id);
  }

  // FIXME: Tamanho com leading zeros

  async update(id: string, data: Partial<WithoutId<Reagent>>): Promise<void> {
    const currentReagent = await this.getById(id);

    if (data.sizes) {
      // Verificando duplicatas
      if (new Set(data.sizes).size !== data.sizes.length)
        throw new Error('Reagente não pode ter tamanho duplicado.');

      super.update(id, data);

      // Deletando items relacionados
      const deletedSizes = currentReagent.sizes.filter(
        (c) => !data.sizes!.some((n) => areSizesEqual(c, n))
      );
      await Promise.all(deletedSizes.map(async (size) => this.deleteItemsRelatedToSize(id, size)));
    }
  }

  private async deleteItemsRelatedToSize(reagentId: string, size: Size) {
    const items = await ItemService.instance.getAll();
    const itemsRelatedToSize = items
      .filter((i) => i.reagentId === reagentId)
      .filter((i) => areSizesEqual(i.size, size));

    await Promise.all(
      itemsRelatedToSize.map(async (item) => await ItemService.instance.delete(item.id))
    );
  }

  private async deleteRelatedItems(id: string) {
    const items = await ItemService.instance.getAll();
    const relatedItems = items.filter((item) => item.reagentId === id);
    await Promise.all(relatedItems.map(async (item) => await ItemService.instance.delete(item.id)));
  }
}
