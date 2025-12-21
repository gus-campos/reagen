import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OmitId } from '@core/models/base.interface';
import { BoxView } from '@features/box/box-view/box-view.component';
import { Box } from '@features/box/box.model';
import { BoxStore } from '@features/box/box.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BoxView],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  boxStore = inject(BoxStore);

  add(value: OmitId<Box>) {
    this.boxStore.add(value);
  }
}
