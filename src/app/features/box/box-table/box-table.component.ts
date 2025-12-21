import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Column, SimpleTable } from '@shared/simple-table/simple-table.component';
import { Box } from '../box.model';
import { BoxStore } from '../box.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'box-table',
  templateUrl: './box-table.component.html',
  imports: [MatTableModule, SimpleTable, MatButtonModule],
})
export class BoxTable {
  boxStore = inject(BoxStore);
  boxes = this.boxStore.boxes;

  // Importando pipe de exibição de data
  datePipe = new DatePipe('pt-BR');

  columns: Column<Box>[] = [
    { id: 'purity', label: 'Pureza', value: (box: Box) => String(box.purity) },
    { id: 'size', label: 'Tamanho', value: (box: Box) => `${box.size.amount} ${box.size.unit}` },
    { id: 'inDate', label: 'Entrada', value: (box: Box) => this.datePipe.transform(box.inDate) },
  ];

  constructor() {
    this.boxStore.load();
  }

  remove() {
    const box = this.boxes()[0];
    if (box) this.boxStore.remove(box.id);
  }
}
