import { Package } from '@/features/package/package.type';
import { ViewMode } from '@/features/package/package.view';
import { Reagent } from '@/features/reagent/reagent.type';
import { useData } from '@/providers/data.provider';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export type PackageLayoutProps = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package | null) => void;
  preFilledPackageData?: Partial<Package>;
};

export function usePackageLayout(props: PackageLayoutProps) {
  const { reagentService, packageService } = useDependencyInjection();
  const { getReagentById } = useData();

  const selectedPackageReagent = props.selectedPackage
    ? getReagentById(props.selectedPackage.reagentId)
    : null;

  const isEditModalOpen = props.mode === 'edit';
  const isShowModalOpen = props.mode === 'show';
  const modalTitle = props.selectedPackage ? 'Editar pkg' : 'Adicionar pkg';

  const handleBeginPackageEdit = (pkg: Package) => {
    props.onSelectPackage(pkg);
    props.onModeChange('edit');
  };

  const handleAddReagent = (reagent: Reagent) => {
    return reagentService.create(reagent);
  };

  const handleAddPackage = async (pkg: Package) => {
    props.onModeChange('table');
    return await packageService.create(pkg);
  };

  const handleEditPackage = (pkg: Package) => {
    packageService.update(pkg.id, pkg);
    props.onModeChange('table');
  };

  const handleBeginPackageAddition = () => {
    props.onSelectPackage(null);
    props.onModeChange('edit');
  };

  const handleCloseEditModal = () => props.onModeChange('table');
  const handleCloseShowModal = () => props.onModeChange('table');
  const handleBeginShownPackageEdit = () => {
    handleBeginPackageEdit(props.selectedPackage!);
  };

  return {
    selectedPackageReagent,
    isEditModalOpen,
    isShowModalOpen,
    modalTitle,
    selectedPackage: props.selectedPackage,
    handleBeginPackageAddition,
    handleAddReagent,
    handleAddPackage,
    handleEditPackage,
    handleCloseEditModal,
    handleCloseShowModal,
    handleBeginShownPackageEdit,
  };
}
