import { useRouter } from 'next/navigation';
import { PackageLayoutProps } from '@/features/package/components/package-layout.view';
import { PackageService } from '@/features/package/package.service';
import { Package } from '@/features/package/package.type';
import { ReagentService } from '@/features/reagent/reagent.service';
import { Reagent } from '@/features/reagent/reagent.type';
import { StockFilter } from '@/features/stock-filter/stock-filter.type';
import { useData } from '@/providers/data.provider';
import { useNavigationData } from '@/providers/navigation-data.provider';

type UsePackageLayoutProps = PackageLayoutProps & {
  reagentService: ReagentService;
  packageService: PackageService;
  filter?: StockFilter;
};

export function usePackageLayout(props: UsePackageLayoutProps) {
  const { getReagentById } = useData();

  // REDIRECT WITH NAVIGATION DATA
  const router = useRouter();
  const { handleSetFilter } = useNavigationData();
  const handleReportWithCurrentFilter = () => {
    handleSetFilter(props.filter ?? null);
    router.push('/relatorio');
  };

  const selectedPackageReagent = props.selectedPackage
    ? getReagentById(props.selectedPackage.reagentId)
    : null;

  const isEditModalOpen = props.mode === 'edit';
  const isShowModalOpen = props.mode === 'show';
  const modalTitle = props.selectedPackage ? 'Editar pacote' : 'Adicionar pacote';

  const handleBeginPackageEdit = (pkg: Package) => {
    props.onSelectPackage(pkg);
    props.onModeChange('edit');
  };

  const handleAddReagent = (reagent: Reagent) => {
    return props.reagentService.create(reagent);
  };

  const handleAddPackage = async (pkg: Package) => {
    props.onModeChange('table');
    return await props.packageService.create(pkg);
  };

  const handleEditPackage = (pkg: Package) => {
    props.packageService.update(pkg.id, pkg);
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
    handleReportWithCurrentFilter,
  };
}
