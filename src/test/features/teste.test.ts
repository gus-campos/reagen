import { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePackageVialsTable } from '@/features/package/components/package-vials-table.viewmodel';
import { Package } from '@/features/package/package.type';
import Unit from '@/features/size/unit.type';
import { VialService } from '@/features/vial/vial.service';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { IDatabase } from '@/shared/services/base-repository.service';

vi.mock('@/providers/data.provider', () => ({
  DataProvider: ({ children }: { children: ReactNode }) => children,
  useData: vi.fn(),
}));

describe('usePackageVialsTable', () => {
  let vialService: VialService;
  const mockVials: Vial[] = [
    { id: '1', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '2', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '3', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '4', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '5', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '6', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '7', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '8', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '9', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
    { id: '10', packageId: 'pkg1', laboratoryId: 'lab1', outDate: null },
  ];

  const packages: Package[] = [
    {
      id: 'pk1',
      size: { amount: 10, unit: Unit.Gram },
      purity: 12,
      inDate: new Date(),
      expireDate: new Date(),
      reagentId: 'reag1',
      brandId: 'brand1',
      supplierId: 'supp1',
    },
  ];

  const outDate = new Date();

  beforeEach(() => {
    const db = null! as IDatabase; // placeholder
    vialService = new VialService(db);
    vi.spyOn(vialService, 'update').mockImplementation(() => Promise.resolve());

    vi.mocked(useData).mockReturnValue({
      vials: mockVials,
      getLaboratoryById: (id: string) => ({ id, name: 'Lab Test' }),
    } as any);
  });

  it('deve dar saída em 4 frascos', async () => {
    const { result } = renderHook(() =>
      usePackageVialsTable({
        data: packages[0],
        vialService,
      })
    );

    // Estado inicial: 1 grupo com 10 frascos
    expect(result.current.packageVialGroups.length).toBe(1);
    expect(result.current.packageVialGroups[0].vials.length).toBe(10);
    expect(result.current.packageVialGroups[0].outDate).toBeNull();

    // Dar saída em 4 frascos
    act(() => {
      result.current.outVialsSubmit({ amount: 4, outDate });
    });

    // Verificar que vialService.update foi chamado 4 vezes
    expect(vialService.update).toHaveBeenCalledTimes(4);
    expect(vialService.update).toHaveBeenCalledWith('1', { outDate: expect.any(Date) });
    expect(vialService.update).toHaveBeenCalledWith('2', { outDate: expect.any(Date) });
    expect(vialService.update).toHaveBeenCalledWith('3', { outDate: expect.any(Date) });
    expect(vialService.update).toHaveBeenCalledWith('4', { outDate: expect.any(Date) });
  });

  it('deve cancelar saída de 2 frascos', async () => {
    // Mock com 4 frascos já com saída
    const vialsComSaida = mockVials.map((v, i) => ({
      ...v,
      outDate: i < 4 ? new Date('2024-01-15') : null,
    }));

    vi.mocked(useData).mockReturnValue({
      vials: vialsComSaida,
      getLaboratoryById: (id: string) => ({ id, name: 'Lab Test' }),
    } as any);

    const { result } = renderHook(() =>
      usePackageVialsTable({
        data: packages[0],
        vialService,
      })
    );

    // Deve ter 2 grupos: com saída (4) e sem saída (6)
    expect(result.current.packageVialGroups.length).toBe(2);
    const grupoComSaida = result.current.packageVialGroups.find((g) => g.outDate !== null);
    expect(grupoComSaida!.vials.length).toBe(4);

    // Cancelar saída de 2 frascos
    act(() => {
      result.current.outVialsSubmit({ amount: 4, outDate });
    });

    // Verificar que update foi chamado com outDate: null
    expect(vialService.update).toHaveBeenCalledTimes(2);
    expect(vialService.update).toHaveBeenCalledWith('1', { outDate: null });
    expect(vialService.update).toHaveBeenCalledWith('2', { outDate: null });
  });

  it('deve validar quantidade inválida', () => {
    const { result } = renderHook(() =>
      usePackageVialsTable({
        data: packages[0],
        vialService,
      })
    );

    // Tentar dar saída em mais frascos do que existe
    act(() => {
      result.current.outVialsSubmit({ amount: 20, outDate });
    });

    // Não deve chamar update
    expect(vialService.update).not.toHaveBeenCalled();
  });
});
