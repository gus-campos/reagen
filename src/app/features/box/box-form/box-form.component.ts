import { Component, output, inject, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Reagent, ReagentId } from '@features/reagent/reagent.model';
import { Unit } from '@features/reagent/unit.model';
import { Brand, BrandId } from '@features/validated-options/brand.model';
import { Supplier, SupplierId } from '@features/validated-options/supplier.model';
import { Box } from '../box.model';
import { OmitId } from '@core/models/base.interface';
import { Dimension } from '@features/reagent/dimension.model';
import { showSize, Size } from '@features/reagent/size.model';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReagentRepository } from '@features/reagent/reagent.service';

@Component({
  selector: 'box-form',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './box-form.component.html',
  styles: `
    .form {
      display: flex;
      flex-wrap: no-wrap;
      flex-direction: column;
    }`,
})
export class BoxForm {
  private fb = inject(FormBuilder);

  // IO
  submitForm = output<OmitId<Box>>();

  // Form
  boxForm = this.fb.group({
    inDate: [null as Date | null, Validators.required],
    expireDate: [null as Date | null, Validators.required],
    reagentId: [null as ReagentId | null, Validators.required],
    brandId: [null as BrandId | null, Validators.required],
    supplierId: [null as SupplierId | null, Validators.required],
    size: [null as Size | null, Validators.required],
    purity: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  selectedReagent$!: Observable<Reagent | null>;
  sizes$!: Observable<Size[] | null>;
  reagents!: Observable<Reagent[]>;

  constructor(private reagentsRepository: ReagentRepository) {
    this.reagents = this.reagentsRepository.getAll();

    // Observables derivados do form

    this.selectedReagent$ = this.boxForm.get('reagentId')!.valueChanges.pipe(
      startWith(null),
      switchMap((reagentId) =>
        this.reagents.pipe(map((reagents) => reagents.find((r) => r.id === reagentId) ?? null))
      )
    );

    this.sizes$ = this.selectedReagent$.pipe(map((reagent) => reagent?.sizes ?? null));

    // Gerando reação do unit quando mudar reagent
    this.boxForm.get('reagentId')!.valueChanges.subscribe((value) => {
      const unitControl = this.boxForm.get('size')!;
      if (value) {
        unitControl.enable();
      } else {
        unitControl.disable();
      }
      unitControl.updateValueAndValidity();
    });
  }

  brands: Brand[] = [
    { id: '0' as BrandId, name: 'Marca A' },
    { id: '1' as BrandId, name: 'Marca B' },
  ];

  suppliers: Supplier[] = [
    { id: '0' as SupplierId, name: 'Fornecedor A' },
    { id: '1' as SupplierId, name: 'Fornecedor B' },
  ];

  // Handlers
  onSubmit() {
    if (this.boxForm.invalid) {
      console.log('Error:', this.boxForm.errors);
      return;
    }

    const formData = this.boxForm.getRawValue();
    const box: OmitId<Box> = {
      size: {
        amount: formData.size!.amount!,
        unit: formData.size!.unit!,
      },
      purity: formData.purity!,
      inDate: formData.inDate!,
      expireDate: formData.expireDate!,
      reagentId: formData.reagentId!,
      brandId: formData.brandId!,
      supplierId: formData.supplierId!,
    };

    this.submitForm.emit(box);
  }

  showSize = showSize;

  getPurityErrorMessage(): string | null {
    const control = this.boxForm.get('purity')!;
    if (!control?.errors) return null;

    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['min'] || control.errors['max']) return 'O valor deve estar entre 0 e 100';

    return null;
  }
}
