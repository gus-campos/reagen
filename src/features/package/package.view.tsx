import { PackageLayout } from '@/features/package/components/package-layout.view';
import { PackageTable } from '@/features/package/components/package-table.view';
import { usePackageView } from '@/features/package/package.modelview';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';

export type PackageViewProps = {
  filter?: StockFilter;
  search?: string;
};

export type ViewMode = 'show' | 'edit' | 'table';

export function PackageView(props: PackageViewProps) {
  const { crudOperations, handleChangeMode, mode, selectedPackage, handleSelectPackage } =
    usePackageView();

  return (
    <>
      <PackageLayout
        mode={mode}
        selectedPackage={selectedPackage}
        onModeChange={handleChangeMode}
        onSelectPackage={handleSelectPackage}
      />
      <PackageTable filter={props.filter} search={props.search} crudOperations={crudOperations} />
    </>
  );
}
