import { WithoutId } from '@/src/shared/services/data.service';
import { FirebaseBaseService } from '@/src/shared/services/firabse-base.service';
import { ReagentService } from '../reagent/reagent.service';
import { Reagent } from '../reagent/reagent.type';
import { Size } from '../size/size.type';
import { areSizesEqual } from '../size/size.util';
import { VialService } from '../vial/vial.service';
import { Package } from './package.type';

const DOC_NAME = 'packages';

export class PackageService extends FirebaseBaseService<Package> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: PackageService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new PackageService();
    return this._instance;
  }

  async add(pkg: WithoutId<Package>) {
    const relatedReagent = await ReagentService.instance.getById(pkg.reagentId);

    if (!PackageService.isSizeValidInReagent(pkg.size, relatedReagent))
      throw new Error('O tamanho não é válido para o reagente referenciado.');

    const pkgId = await super.add(pkg);
    return pkgId;
  }

  async update(id: string, data: Partial<WithoutId<Package>>) {
    // Se o tamanho for modificado, verificar a validade do novo tamanho
    if (data.size !== undefined) {
      const vialToUpdate = await PackageService.instance.getById(id);

      if (!areSizesEqual(vialToUpdate.size, data.size)) {
        const relatedReagent = await ReagentService.instance.getById(vialToUpdate.reagentId);

        if (!PackageService.isSizeValidInReagent(data.size, relatedReagent))
          throw new Error('O tamanho não é válido para o reagente referenciado.');
      }
    }

    // Não permitir editar o reagente
    if (data.reagentId !== undefined) {
      const vialToUpdate = await PackageService.instance.getById(id);

      if (data.reagentId !== vialToUpdate.reagentId)
        throw new Error('Não é permitido editar o reagente');
    }

    super.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.deleteRelatedVials(id);
    await super.delete(id);
  }

  private static async isSizeValidInReagent(sizeToValidate: Size, reagent: Reagent) {
    return reagent.sizes.some(
      (size) => size.amount === sizeToValidate.amount && size.unit === sizeToValidate.unit
    );
  }

  private async deleteRelatedVials(packageId: string) {
    const vials = await VialService.instance.getAll();
    const relatedVials = vials.filter((vial) => vial.packageId === packageId);
    await Promise.all(relatedVials.map((vial) => VialService.instance.delete(vial.id)));
  }
}
