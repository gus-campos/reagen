import { StockFilter } from '../stock-filter/stock-filter';
import { usePackageView } from './package.modelview';
import { PackageLayout } from './views/PackageLayout';
import { PackageTable } from './views/PackageTable';

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
