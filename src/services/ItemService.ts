import { Item } from '../models/item';
import { Reagent } from '../models/reagent';
import { Size } from '../models/size';
import { areSizesEqual } from '../utils/size';
import { FirebaseBaseService } from './base/FirebaseBaseService';
import { WithoutId } from './base/IDataService';
import { ReagentService } from './ReagentService';

const DOC_NAME = 'items';

export class ItemService extends FirebaseBaseService<Item> {
  constructor() {
    super(DOC_NAME);
  }

  private static _instance: ItemService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new ItemService();
    return this._instance;
  }

  async add(item: WithoutId<Item>) {
    const relatedReagent = await ReagentService.instance.getById(item.reagentId);

    if (!ItemService.isSizeValidInReagent(item.size, relatedReagent))
      throw new Error('O tamanho não é válido para o reagente referenciado.');

    const itemId = await super.add(item);
    return itemId;
  }

  async update(id: string, data: Partial<WithoutId<Item>>) {
    // Se o tamanho for modificado, verificar a validade do novo tamanho
    if (data.size !== undefined) {
      const itemToUpdate = await ItemService.instance.getById(id);

      if (!areSizesEqual(itemToUpdate.size, data.size)) {
        const relatedReagent = await ReagentService.instance.getById(itemToUpdate.reagentId);

        if (!ItemService.isSizeValidInReagent(data.size, relatedReagent))
          throw new Error('O tamanho não é válido para o reagente referenciado.');
      }
    }

    // Não permitir editar o reagente
    if (data.reagentId !== undefined) {
      const itemToUpdate = await ItemService.instance.getById(id);

      if (data.reagentId !== itemToUpdate.reagentId)
        throw new Error('Não é permitido editar o reagente');
    }

    super.update(id, data);
  }

  private static async isSizeValidInReagent(size: Size, reagent: Reagent) {
    return reagent.sizes.some((size) => size.amount === size.amount && size.unit === size.unit);
  }
}
