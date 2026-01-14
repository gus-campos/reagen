import { PackageService } from '@/features/package/package.service';
import { Reagent } from '@/features/reagent/reagent.type';
import { Size } from '@/features/size/size.type';
import { areSizesEqual } from '@/features/size/size.util';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { OmitId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class ReagentService extends BaseRepository<Reagent> {
  private packageService?: PackageService;

  constructor(db: IDatabase) {
    super(db, DatabaseTableName.Reagent);
  }

  injectLate(packageService: PackageService) {
    this.packageService = packageService;
  }

  private checkLateInjection() {
    if (!this.packageService) throw new Error('packageService não injetado');
  }

  async delete(id: string): Promise<void> {
    /* Deleta primeiro todas os itens com referências a este reagente, depois deleta o reagente */
    await this.deleteRelatedPackages(id);
    await super.delete(id);
  }

  // FIXME: Tamanho com leading zeros ??? Não pode!

  async update(id: string, data: Partial<OmitId<Reagent>>): Promise<void> {
    /* Além de atualizar, verifica por duplicatas de tamanho, e para cada tamanho deletado, deleta 
    os vials que os usavam.  */

    const currentReagent = await this.getById(id);

    if (!currentReagent) throw new Error('reagente não encontrado para atualização');

    if (data.sizes) {
      // Verificando diplicatas
      if (new Set(data.sizes).size !== data.sizes.length)
        throw new Error('Reagente não pode ter tamanho duplicado.');

      await super.update(id, data);

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
    this.checkLateInjection();
    const packages = await this.packageService!.getAll();
    const pkgsRelatedToSize = packages.filter(
      (p) => p.reagentId === reagentId && areSizesEqual(p.size, size)
    );

    await Promise.all(pkgsRelatedToSize.map(async (p) => await this.packageService!.delete(p.id)));
  }

  private async deleteRelatedPackages(reagentId: string) {
    /* Deleta todos os itens relacionados a um reagente */
    this.checkLateInjection();
    const packages = await this.packageService!.getAll();
    const relatedPkgs = packages.filter((p) => p.reagentId === reagentId);
    await Promise.all(relatedPkgs.map(async (p) => await this.packageService!.delete(p.id)));
  }
}
