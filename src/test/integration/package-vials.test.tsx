import { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { beforeEach, describe, expect, it } from 'vitest';
import { auth } from '@/core/config/firebase';
import { usePackageVialsTable } from '@/features/package/components/package-vials-table.viewmodel';
import { PackageService } from '@/features/package/package.service';
import { Package } from '@/features/package/package.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import Unit, { Dimension } from '@/features/size/unit.type';
import { VialService } from '@/features/vial/vial.service';
import { Vial } from '@/features/vial/vial.type';
import { DataProvider } from '@/providers/data.provider';
import { DependencyInjectionProvider } from '@/providers/dependency-injection.provider';
import { FirebaseBaseDatabase } from '@/shared/services/firebase-base.service';

const wrapper = ({ children }: { children: ReactNode }) => (
  <DependencyInjectionProvider>
    <DataProvider>{children}</DataProvider>
  </DependencyInjectionProvider>
);

describe('usePackageVialsTable - Integration', () => {
  let mockPackage: Package;
  let vialService: VialService;

  const mockVials: Omit<Vial, 'id'>[] = Array.from({ length: 10 }, () => ({
    packageId: '',
    laboratoryId: 'lab1',
    outDate: null,
  }));

  beforeEach(async () => {
    const db = new FirebaseBaseDatabase();
    const reagentService = new ReagentService(db);
    const packageService = new PackageService(db);
    vialService = new VialService(db);

    reagentService.injectLate(packageService);
    packageService.injectLate(reagentService, vialService);

    await signInWithEmailAndPassword(auth, 'teste@email.com', 'senhaforte');

    // Limpa e cria dados
    await reagentService.clear();
    const reagent = await reagentService.create({
      controlAgencyId: null,
      dimension: Dimension.Count,
      name: 'Reagent Test',
      sizes: [{ amount: 10, unit: Unit.Gram }],
    });

    await packageService.clear();
    mockPackage = await packageService.create({
      size: { amount: 10, unit: Unit.Gram },
      purity: 12,
      inDate: new Date(),
      expireDate: new Date(),
      reagentId: reagent.id,
      fundingSourceId: 'fundingSource1',
      supplierId: 'supp1',
    });

    await vialService.clear();
    await vialService.insert(mockVials.map((v) => ({ ...v, packageId: mockPackage.id })));
  });

  it('deve dar saída em 4 frascos', async () => {
    const { result } = renderHook(() => usePackageVialsTable({ pkg: mockPackage, vialService }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.packageVialGroups[0]?.vials.length).toBe(10);
    });

    act(() => {
      result.current.test_outVialsSubmit(
        { amount: 4, outDate: new Date() },
        'out',
        result.current.packageVialGroups[0]
      );
    });

    await waitFor(async () => {
      const vials = await vialService.getAll();
      const vialsComSaida = vials.filter((v) => v.outDate !== null);
      expect(vialsComSaida.length).toBe(4);
    });
  });

  it('deve cancelar saída de 2 frascos', async () => {
    // Cria vials com saída
    await vialService.clear();
    const vialsComSaida = mockVials.map((v, i) => ({
      ...v,
      packageId: mockPackage.id,
      outDate: i < 4 ? new Date('2024-01-15') : null,
    }));
    await vialService.insert(vialsComSaida);

    const { result } = renderHook(() => usePackageVialsTable({ pkg: mockPackage, vialService }), {
      wrapper,
    });

    await waitFor(() => {
      const grupos = result.current.packageVialGroups;
      expect(grupos.filter((g) => g.outDate !== null).length).toBe(1);
    });

    const grupoComSaida = result.current.packageVialGroups.find((g) => g.outDate !== null)!;

    act(() => {
      result.current.test_outVialsSubmit(
        { amount: 2, outDate: new Date() },
        'cancel',
        grupoComSaida
      );
    });

    await waitFor(async () => {
      const vials = await vialService.getAll();
      const vialsComSaida = vials.filter((v) => v.outDate !== null);
      expect(vialsComSaida.length).toBe(2);
    });
  });

  it('deve validar quantidade inválida', async () => {
    const { result } = renderHook(() => usePackageVialsTable({ pkg: mockPackage, vialService }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.packageVialGroups[0]?.vials.length).toBe(10);
    });

    const vialsAntes = await vialService.getAll();

    act(() => {
      result.current.test_outVialsSubmit(
        { amount: 20, outDate: new Date() },
        'out',
        result.current.packageVialGroups[0]
      );
    });

    const vialsDepois = await vialService.getAll();
    expect(vialsDepois).toEqual(vialsAntes);
  });
});
