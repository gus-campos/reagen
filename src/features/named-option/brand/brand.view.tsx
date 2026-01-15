import { NamedOptionView } from '@/features/named-option/named-option.view';
import { useBrandsView } from '@/features/named-option/brand/brand.viewmodel';

export function BrandsView() {
  const { brandService, brands, loadingBrands, getWarning } = useBrandsView();

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
