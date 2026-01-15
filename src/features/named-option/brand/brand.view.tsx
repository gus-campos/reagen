import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useBrandsView } from '@/features/named-option/brand/brand.viewmodel';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export function BrandsView() {
  const { brandService } = useDependencyInjection();
  const { brands, loadingBrands, getWarning } = useBrandsView();

  return (
    <NamedOptionView
      loadingData={loadingBrands}
      datas={brands}
      dataName="Marca"
      repositoryService={brandService}
      getDeleteWarning={getWarning}
    />
  );
}
