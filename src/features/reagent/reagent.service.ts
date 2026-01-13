import { WithoutId } from '@/src/shared/services/data.service';
import { FirebaseBaseService } from '@/src/shared/services/firabse-base.service';
import { PackageService } from '../package/package.service';
import { Size } from '../size/size.type';
import { areSizesEqual } from '../size/size.util';
import { Reagent } from './reagent.type';

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
    await this.deleteRelatedPackages(id);
    await super.delete(id);
  }

  // FIXME: Tamanho com leading zeros ??? Não pode!

  async update(id: string, data: Partial<WithoutId<Reagent>>): Promise<void> {
    /* Além de atualizar, verifica por duplicatas de tamanho, e para cada tamanho deletado, deleta 
    os vials que os usavam.  */

    const currentReagent = await this.getById(id);

    if (data.sizes) {
      // Verificando diplicatas
      if (new Set(data.sizes).size !== data.sizes.length)
        throw new Error('Reagente não pode ter tamanho duplicado.');

      super.update(id, data);

      // Deletando vials relacionados
      const deletedSizes = currentReagent.sizes.filter(
        (c) => !data.sizes!.some((n) => areSizesEqual(c, n))
      );
      await Promise.all(
        deletedSizes.map(async (size) => this.deletePackagesRelatedToSize(id, size))
      );
    }
  }

  private async deletePackagesRelatedToSize(reagentId: string, size: Size) {
    /* Deleta todos os itens relacionados a dado reagente e um dado tamanho */
    const packages = await PackageService.instance.getAll();
    const pkgsRelatedToSize = packages.filter(
      (p) => p.reagentId === reagentId && areSizesEqual(p.size, size)
    );

    await Promise.all(
      pkgsRelatedToSize.map(async (p) => await PackageService.instance.delete(p.id))
    );
  }

  private async deleteRelatedPackages(reagentId: string) {
    /* Deleta todos os itens relacionados a um reagente */
    const packages = await PackageService.instance.getAll();
    const relatedPkgs = packages.filter((p) => p.reagentId === reagentId);
    await Promise.all(relatedPkgs.map(async (p) => await PackageService.instance.delete(p.id)));
  }
}
