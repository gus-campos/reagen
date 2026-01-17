import { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePackageVialsTable } from '@/features/package/components/package-vials-table.viewmodel';
import { Package } from '@/features/package/package.type';
import Unit from '@/features/size/unit.type';
import { VialService } from '@/features/vial/vial.service';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';
import { IDatabase } from '@/shared/services/base-repository.service';

vi.mock('@/providers/data.provider', () => ({
  DataProvider: ({ children }: { children: ReactNode }) => children,
  useData: vi.fn(),
}));

vi.mock('@/providers/dependency-injection.provider', () => ({
  DependencyInjectionProvider: ({ children }: { children: ReactNode }) => children,
  useDependencyInjection: vi.fn(),
}));

describe('usePackageVialsTable', () => {
  let vialService: VialService;
  const mockVials: Vial[] = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    packageId: 'pkg1',
    laboratoryId: 'lab1',
    outDate: null,
  }));

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

  const mockAuthService = {
    user: { uid: 'user-123', email: 'teste@test.com' },
    login: vi.fn(),
    logout: vi.fn(),
    listen: vi.fn(),
  };

  const outDate = new Date();

  beforeEach(() => {
    const db = null! as IDatabase;
    vialService = new VialService(db);
    vi.spyOn(vialService, 'update').mockResolvedValue(undefined);

    // Mock do useData como função
    vi.mocked(useData).mockImplementation(
      () =>
        ({
          vials: mockVials,
          getLaboratoryById: (id: string) => ({ id, name: 'Lab Test' }),
        }) as any
    );

    // Mock do useDependencyInjection como função
    vi.mocked(useDependencyInjection).mockImplementation(
      () =>
        ({
          authService: mockAuthService,
        }) as any
    );
  });

  it('deve dar saída em 4 frascos', async () => {
    vi.mocked(useData).mockReturnValue({
      vials: mockVials,
      getLaboratoryById: (id: string) => ({ id, name: 'Lab Test' }),
    } as any);

    vi.mocked(useDependencyInjection).mockReturnValue({
      authService: mockAuthService,
    } as any);

    const { result } = renderHook(() => usePackageVialsTable({ data: packages[0], vialService }));

    expect(result.current.packageVialGroups.length).toBe(1);
    expect(result.current.packageVialGroups[0].vials.length).toBe(10);
    expect(result.current.packageVialGroups[0].outDate).toBeNull();

    act(() => {
      result.current.outVialsSubmit({ amount: 4, outDate });
    });

    expect(vialService.update).toHaveBeenCalledTimes(4);
    expect(vialService.update).toHaveBeenCalledWith('1', { outDate: expect.any(Date) });
    expect(vialService.update).toHaveBeenCalledWith('2', { outDate: expect.any(Date) });
    expect(vialService.update).toHaveBeenCalledWith('3', { outDate: expect.any(Date) });
    expect(vialService.update).toHaveBeenCalledWith('4', { outDate: expect.any(Date) });
  });

  it('deve cancelar saída de 2 frascos', async () => {
    const vialsComSaida = mockVials.map((v, i) => ({
      ...v,
      outDate: i < 4 ? new Date('2024-01-15') : null,
    }));

    vi.mocked(useData).mockReturnValue({
      vials: vialsComSaida,
      getLaboratoryById: (id: string) => ({ id, name: 'Lab Test' }),
    } as any);

    vi.mocked(useDependencyInjection).mockReturnValue({
      authService: mockAuthService,
    } as any);

    const { result } = renderHook(() => usePackageVialsTable({ data: packages[0], vialService }));

    // Agora deve ter 2 grupos: com saída (4) e sem saída (6)
    const gruposComSaida = result.current.packageVialGroups.filter((g) => g.outDate !== null);
    const gruposSemSaida = result.current.packageVialGroups.filter((g) => g.outDate === null);

    expect(gruposComSaida.length).toBe(1);
    expect(gruposComSaida[0].vials.length).toBe(4);
    expect(gruposSemSaida.length).toBe(1);
    expect(gruposSemSaida[0].vials.length).toBe(6);

    act(() => {
      result.current.outVialsSubmit({ amount: 2, outDate });
    });

    expect(vialService.update).toHaveBeenCalledTimes(2);
    expect(vialService.update).toHaveBeenCalledWith('1', { outDate: null });
    expect(vialService.update).toHaveBeenCalledWith('2', { outDate: null });
  });

  it('deve validar quantidade inválida', () => {
    vi.mocked(useData).mockReturnValue({
      vials: mockVials,
      getLaboratoryById: (id: string) => ({ id, name: 'Lab Test' }),
    } as any);

    vi.mocked(useDependencyInjection).mockReturnValue({
      authService: mockAuthService,
    } as any);

    const { result } = renderHook(() => usePackageVialsTable({ data: packages[0], vialService }));

    act(() => {
      result.current.outVialsSubmit({ amount: 20, outDate });
    });

    expect(vialService.update).not.toHaveBeenCalled();
  });
});
