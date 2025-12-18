import { Component, inject } from '@angular/core';
import { VialStore } from './vial.store';
import { BoxId } from '@features/box/box.model';
import { LabId } from '@features/validated-options/lab.model';
import { VialId } from './vial.model';

@Component({
  selector: 'vial-view',
  template: ``,
  styles: `
    button {
      background-color: grey;
    }

    .vial-container {
      background-color: grey;
    }
  `,
})
export class VialView {
  readonly vialStore = inject(VialStore);
  readonly vials = this.vialStore.vials;

  ngOnInit() {
    this.vialStore.load();
  }

  add() {
    this.vialStore.add({ boxId: '' as BoxId, labId: '' as LabId, outDate: new Date() });
  }

  delete(id: VialId) {
    this.vialStore.remove(id);
  }
}
