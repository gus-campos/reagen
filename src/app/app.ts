import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoxView } from '@features/box/box.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BoxView],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  ngOnInit() {}
}
