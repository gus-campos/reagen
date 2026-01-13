import { FirebaseBaseService } from '@/src/shared/services/firabse-base.service';
import { Vial } from './vial.type';

const DOC_NAME = 'vial';

export class VialService extends FirebaseBaseService<Vial> {
  private constructor() {
    super(DOC_NAME);
  }

  private static _instance: VialService | null = null;

  static get instance() {
    if (!this._instance) this._instance = new VialService();
    return this._instance;
  }
}
