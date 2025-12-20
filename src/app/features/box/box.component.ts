import { Component, inject } from '@angular/core';
import { BrandId } from '@features/validated-options/brand.model';
import { ReagentId } from '@features/reagent/reagent.model';
import { SupplierId } from '@features/validated-options/supplier.model';
import { Unit } from '@features/reagent/unit.model';

import { MatTableModule } from '@angular/material/table';
import { Column, SimpleTable } from '@shared/simple-table/simple-table.component';
import { Box, BoxId } from './box.model';

@Component({
  selector: 'box-view',
  imports: [MatTableModule, SimpleTable],
  template: ` <simple-table [data]="boxes" [columns]="columns" /> `,
  styles: ``,
})
export class BoxView {
  columns: Column<Box>[] = [
    { id: 'purity', label: 'Pureza', value: (box: Box) => String(box.purity) },
    { id: 'size', label: 'Tamanho', value: (box: Box) => `${box.size.amount} ${box.size.unit}` },
  ];

  boxes: Box[] = [
    {
      id: '' as BoxId,
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 21,
      size: { amount: 10, unit: Unit.Gram },
    },
    {
      id: '' as BoxId,
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 22,
      size: { amount: 10, unit: Unit.Gram },
    },
    {
      id: '' as BoxId,
      brandId: 'a' as BrandId,
      reagentId: 'b' as ReagentId,
      supplierId: 'c' as SupplierId,
      expireDate: new Date(),
      inDate: new Date(),
      purity: 23,
      size: { amount: 10, unit: Unit.Gram },
    },
  ];
}
