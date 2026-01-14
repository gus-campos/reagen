import { Package } from '@/features/package/package.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import { Reagent } from '@/features/reagent/reagent.type';
import { Size } from '@/features/size/size.type';
import { areSizesEqual } from '@/features/size/size.util';
import { VialService } from '@/features/vial/vial.service';
import { BaseRepository, IDatabase } from '@/shared/services/base-repository.service';
import { OmitId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export class PackageService extends BaseRepository<Package> {
  private reagentService?: ReagentService;
  private vialService?: VialService;

  constructor(db: IDatabase) {
    super(db, DatabaseTableName.Package);
  }

  injectLate(reagentService: ReagentService, vialService: VialService) {
    this.reagentService = reagentService;
    this.vialService = vialService;
  }

  private checkLateInjection() {
    if (!this.reagentService) throw new Error('injeção tardia não realizada');
  }

  private static isSizeValidInReagent(sizeToValidate: Size, reagent: Reagent) {
    return reagent.sizes.some(
      (size) => size.amount === sizeToValidate.amount && size.unit === sizeToValidate.unit
    );
  }

  async create(pkg: OmitId<Package>) {
    this.checkLateInjection();
    const relatedReagent = await this.reagentService!.getById(pkg.reagentId);

    if (!relatedReagent) throw new Error('Não foi possível encontrar o reagente relacionado');

    if (!PackageService.isSizeValidInReagent(pkg.size, relatedReagent))
      throw new Error('O tamanho não é válido para o reagente referenciado.');

    const pkgId = await super.create(pkg);
    return pkgId;
  }

  async update(id: string, data: Partial<OmitId<Package>>) {
    // Se o tamanho for modificado, verificar a validade do novo tamanho
    this.checkLateInjection();
    const vialToUpdate = await this.getById(id);

    if (!vialToUpdate) throw new Error('Frasco não encontrado para atualizar');

    if (data.size !== undefined) {
      if (!areSizesEqual(vialToUpdate.size, data.size)) {
        const relatedReagent = await this.reagentService!.getById(vialToUpdate.reagentId);

        if (!relatedReagent) throw new Error('Não foi possível encontrar o reagente relacionado');

        if (!PackageService.isSizeValidInReagent(data.size, relatedReagent))
          throw new Error('O tamanho não é válido para o reagente referenciado.');
      }
    }

    // Não permitir editar o reagente
    if (data.reagentId !== undefined) {
      if (data.reagentId !== vialToUpdate.reagentId)
        throw new Error('Não é permitido editar o reagente');
    }

    await super.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedVials(id);
    await super.delete(id);
  }

  private async deleteRelatedVials(packageId: string) {
    this.checkLateInjection();
    const vials = await this.vialService!.getAll();
    const relatedVials = vials.filter((vial) => vial.packageId === packageId);
    await Promise.all(relatedVials.map((vial) => this.vialService!.delete(vial.id)));
  }
}
