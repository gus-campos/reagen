import { FirebaseBaseService } from '@/src/shared/services/FirebaseBaseService';
import { VialService } from '../vial/services/VialService';
import { Laboratory } from './laboratory';

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
    const vials = await VialService.instance.getAll(); // TODO: Poderia ser query
    const relatedVials = vials.filter((i) => i.laboratoryId === laboratoryId);
    await Promise.all(relatedVials.map((i) => VialService.instance.delete(i.id)));
  }
}
