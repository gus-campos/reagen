import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { BoxId } from '@features/box/box.model';
import { LabId } from '@features/validated-options/lab.model';
import { Vial } from '@features/vial/vial.model';
import { VialService } from '@features/vial/vial.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly service = inject(VialService);

  readonly vials = signal<Vial[]>([]);

  ngOnInit() {
    this.service.getAll().subscribe((v) => this.vials.set(v));
  }

  update() {
    this.service
      .create({ boxId: 'a' as BoxId, labId: 'b' as LabId, outDate: new Date() })
      .subscribe(() => {
        this.service.getAll().subscribe((v) => this.vials.set(v));
      });

    console.log(this.vials());
  }
}
