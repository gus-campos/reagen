import { Component, inject } from '@angular/core';
import { OmitId } from '@core/models/base.interface';
import { BoxForm } from '@features/box/box-form/box-form.component';
import { BoxTable } from '@features/box/box-table/box-table.component';
import { Box } from '@features/box/box.model';
import { BoxStore } from '@features/box/box.store';

@Component({
  selector: 'box-view',
  imports: [BoxForm, BoxTable],
  templateUrl: './box-view.component.html',
})
export class BoxView {
  boxStore = inject(BoxStore);

  add(box: OmitId<Box>) {
    this.boxStore.add(box);
  }
}
