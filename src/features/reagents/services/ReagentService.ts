import { WithoutId } from '@/src/shared/services/DataService';
import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { ItemService } from '../../items/services/ItemService';
import { Reagent } from '../types/reagent';
import { Size } from '../types/size';
import { areSizesEqual } from '../utils/areSizesEqual';

const DOC_NAME = 'reagents';

export class ReagentService extends FirebaseBaseService<Reagent> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: ReagentService | null = null;

  public static get instance() {
    if (!this._instance) this._instance = new ReagentService();
    return this._instance;
  }

  async delete(id: string): Promise<void> {
    /* Deleta primeiro todas os itens com referências a este reagente, depois deleta o reagente */
    await this.deleteRelatedItems(id);
    await super.delete(id);
  }

  // FIXME: Tamanho com leading zeros ??

  async update(id: string, data: Partial<WithoutId<Reagent>>): Promise<void> {
    /* Além de atualizar, verifica por duplicatas de tamanho, e para cada tamanho deletado, deleta 
    os items que os usavam.  */

    const currentReagent = await this.getById(id);

    if (data.sizes) {
      // Verificando diplicatas
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
    /* Deleta todos os itens relacionados a dado reagente e um dado tamanho */
    const items = await ItemService.instance.getAll();
    const itemsRelatedToSize = items
      .filter((i) => i.reagentId === reagentId)
      .filter((i) => areSizesEqual(i.size, size));

    await Promise.all(
      itemsRelatedToSize.map(async (item) => await ItemService.instance.delete(item.id))
    );
  }

  private async deleteRelatedItems(reagentId: string) {
    /* Deleta todos os itens relacionados a um reagente */
    const items = await ItemService.instance.getAll();
    const relatedItems = items.filter((item) => item.reagentId === reagentId);
    await Promise.all(relatedItems.map(async (item) => await ItemService.instance.delete(item.id)));
  }
}
