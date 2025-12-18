import { Component, inject } from '@angular/core';
import { VialStore } from './vial.store';
import { BoxId } from '@features/box/box.model';
import { LabId } from '@features/validated-options/lab.model';
import { VialId } from './vial.model';

@Component({
  selector: 'vial-view',
  templateUrl: './vial.component.html',
  styleUrl: './vial.component.css',
})
export class VialView {
  readonly vialStore = inject(VialStore);
  readonly vials = this.vialStore.vials;

  ngOnInit() {
    this.vialStore.loadVials();
  }

  add() {
    this.vialStore.addVial({ boxId: '' as BoxId, labId: '' as LabId, outDate: new Date() });
  }

  delete(id: VialId) {
    this.vialStore.removeVial(id);
  }
}
