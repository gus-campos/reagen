import { Component, inject } from '@angular/core';
import { BoxStore } from './box.store';

@Component({
  selector: 'vial-view',
  template: ``,
  styles: ``,
})
export class BoxView {
  readonly boxStore = inject(BoxStore);
  readonly vials = this.boxStore.boxes;

  ngOnInit() {
    this.boxStore.load();
  }
}
