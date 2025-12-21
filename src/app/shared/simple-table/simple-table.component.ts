import { Component, computed, effect, input, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';

export type Column<T> = {
  id: string;
  label: string;
  render?: (data: T) => string;
  // Para fazer sorting, e se n tiver render, exibir
  value: (data: T) => unknown;
};

@Component({
  selector: 'simple-table',
  templateUrl: './simple-table.component.html',
  imports: [MatTableModule, MatSortModule],
})
export class SimpleTable<T> {
  data = input.required<T[]>();
  columns = input.required<Column<T>[]>();
  columnsLabels = computed(() => this.columns().map((col) => col.label));
  columnsIds = computed(() => this.columns().map((col) => col.id));

  // Gerencia de forma avançada os dados
  dataSource = signal(new MatTableDataSource<T>());

  // Para capturar a diretiva que ordena os dados no template
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Para associar os dados ao dataSource
    effect(() => {
      this.dataSource().data = this.data();
    });

    // Para associar a diretiva ordenadora ao dataSource
    effect(() => {
      if (this.sort) {
        this.dataSource().sort = this.sort;
      }
    });
  }

  // Associa logo depois da inicialização
  ngAfterViewInit() {
    this.dataSource().sort = this.sort;
  }
}
