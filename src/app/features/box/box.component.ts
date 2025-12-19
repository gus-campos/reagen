import { Component, inject } from '@angular/core';
import { BoxStore } from './box.store';
import { BoxId } from './box.model';
import { BrandId } from '@features/validated-options/brand.model';
import { ReagentId } from '@features/reagent/reagent.model';
import { SupplierId } from '@features/validated-options/supplier.model';
import { Unit } from '@features/reagent/unit.model';

import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'box-view',
  imports: [MatTableModule],
  template: ` <!-- Elemento base com diretiva angular -->
    <table mat-table [dataSource]="boxes">
      <!-- Definição da coluna de nome "purity" -->
      <ng-container matColumnDef="purity">
        <!-- Como é o header (com diretiva angular) -->
        <th mat-header-cell *matHeaderCellDef>Pureza</th>
        <!-- Como é a célula (com diretiva angular) -->
        <td mat-cell *matCellDef="let element">{{ element.purity }}</td>
      </ng-container>

      <!-- Define a linha do header -->
      <tr mat-header-row *matHeaderRowDef="['purity']"></tr>
      <!-- Define a linha do código -->
      <tr mat-row *matRowDef="let row; columns: ['purity']"></tr>
    </table>`,
  styles: ``,
})
export class BoxView {
  readonly boxStore = inject(BoxStore);
  // readonly boxes = this.boxStore.boxes;

  readonly boxes = [
    {
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 10,
      size: { amount: 10, unit: Unit.Gram },
    },
    {
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 10,
      size: { amount: 10, unit: Unit.Gram },
    },
    {
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 10,
      size: { amount: 10, unit: Unit.Gram },
    },
    {
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 10,
      size: { amount: 10, unit: Unit.Gram },
    },
    {
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 10,
      size: { amount: 10, unit: Unit.Gram },
    },
  ];

  ngOnInit() {
    this.boxStore.load();
  }

  add() {
    // this.boxStore.add();
  }

  delete(id: BoxId) {
    this.boxStore.remove(id);
  }
}
