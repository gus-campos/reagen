import { PackageFilter } from '../../package-filter/types/package-filter';
import { usePackageView } from '../modelviews/usePackageView';
import { PackageLayout } from './PackageLayout';
import { PackageTable } from './PackageTable';

export type PackageViewProps = {
  filter?: PackageFilter;
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
