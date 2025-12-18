import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { VialView } from '@features/vial/vial.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, VialView],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
