import { Laboratory } from '@/features/laboratory/laboratory.type';
import { VialService } from '@/features/vial/vial.service';
import { FirebaseBaseService } from '@/shared/services/firabse-base.service';

const DOC_NAME = 'laboratory';

export class LaboratoryService extends FirebaseBaseService<Laboratory> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: LaboratoryService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new LaboratoryService();
    return this._instance;
  }

  public async delete(id: string): Promise<void> {
    await this.deleteRelatedVials(id);
    await super.delete(id);
  }

  private async deleteRelatedVials(laboratoryId: string) {
    const vials = await VialService.instance.getAll();
    const relatedVials = vials.filter((vial) => vial.laboratoryId === laboratoryId);
    await Promise.all(relatedVials.map((vial) => VialService.instance.delete(vial.id)));
  }
}
