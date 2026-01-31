'use client';

import { CiViewList } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { Button, Drawer, Modal, Tabs } from '@mantine/core';
import { PackageEdit } from '@/features/package/components/package-edit.view';
import { usePackageLayout } from '@/features/package/components/package-layout.viewmodel';
import { PackageShow } from '@/features/package/components/package-show.view';
import { Package } from '@/features/package/package.type';
import { ViewMode } from '@/features/package/package.view';
import { ReagentShow } from '@/features/reagent/components/reagent-show.view';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

export type PackageLayoutProps = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package | null) => void;
  preFilledPackageData?: Partial<Package>;
};

export function PackageLayout(props: PackageLayoutProps) {
  const { reagentService, packageService } = useDependencyInjection();
  const {
    selectedPackageReagent,
    isEditModalOpen,
    isShowModalOpen,
    modalTitle,
    selectedPackage,
    handleBeginPackageAddition,
    handleAddReagent,
    handleAddPackage,
    handleEditPackage,
    handleCloseEditModal,
    handleCloseShowModal,
    handleBeginShownPackageEdit,
  } = usePackageLayout({ ...props, reagentService, packageService });

  return (
    <>
      <Modal
        title={<strong>{modalTitle}</strong>}
        opened={isEditModalOpen}
        onClose={handleCloseEditModal}
      >
        <PackageEdit
          selectedPackage={selectedPackage}
          packageModalOpened={isEditModalOpen}
          onClosePackageModal={handleCloseEditModal}
          onAddPackage={handleAddPackage}
          onEditPackage={handleEditPackage}
          onAddReagent={handleAddReagent}
          onBeginShownPackageEdit={handleBeginShownPackageEdit}
          preFilledPackageData={props.preFilledPackageData}
        />
      </Modal>

      <Drawer
        opened={isShowModalOpen}
        onClose={handleCloseShowModal}
        overlayProps={{ backgroundOpacity: 0.1, blur: 0 }}
        position="right"
      >
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<CiViewList size="18px" />}>
              Visão geral
            </Tabs.Tab>
            <Tabs.Tab value="reagent" leftSection={<CiViewList size="18px" />}>
              Reagente
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview">
            <PackageShow pkg={selectedPackage!} />
          </Tabs.Panel>
          <Tabs.Panel value="reagent">
            <ReagentShow reagent={selectedPackageReagent!} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>

      <Button
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          borderRadius: '30px',
          height: '50px',
        }}
        onClick={handleBeginPackageAddition}
      >
        <IoMdAdd size="20px" /> Dar entrada no estoque
      </Button>
    </>
  );
}
