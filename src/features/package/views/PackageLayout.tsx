'use client';

import { CiViewList } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { Button, Drawer, Modal, Tabs } from '@mantine/core';
import { useData } from '@/src/providers/DataProvider';
import { ReagentService } from '../../reagent/services/ReagentService';
import { Reagent } from '../../reagent/types/reagent';
import { ReagentShow } from '../../reagent/views/ReagentShow';
import { PackageService } from '../services/PackageService';
import { Package } from '../types/package';
import { PackageEdit } from './PackageEdit';
import { PackageShow } from './PackageShow';
import { ViewMode } from './PackageView';

export type PackageLayoutProps = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package | null) => void;
  preFilledPackageData?: Partial<Package>;
};

export function PackageLayout(props: PackageLayoutProps) {
  const { getReagentById } = useData();

  // HANDLERS

  const handleBeginPackageEdit = (pkg: Package) => {
    props.onSelectPackage(pkg);
    props.onModeChange('edit');
  };

  const handleAddReagent = (reagent: Reagent) => {
    return ReagentService.instance.add(reagent);
  };
  const handleAddPackage = async (pkg: Package) => {
    props.onModeChange('table');
    return await PackageService.instance.add(pkg);
  };

  const handleEditPackage = (pkg: Package) => {
    PackageService.instance.update(pkg.id, pkg);
    props.onModeChange('table');
  };

  const handleBeginPackageAddition = () => {
    props.onSelectPackage(null);
    props.onModeChange('edit');
  };

  const selectedPackageReagent = props.selectedPackage
    ? getReagentById(props.selectedPackage.reagentId)
    : null;

  // FIXME: Ícones da coluna da tabela, na frente do botão!!

  return (
    <>
      {/* FIXME: Dados são apagados por fechamento "clicar fora" */}
      {/* Edição de pkg */}
      <Modal
        title={<strong>{props.selectedPackage ? `Editar pkg` : `Adicionar pkg`}</strong>}
        opened={props.mode === 'edit'}
        onClose={() => props.onModeChange('table')}
      >
        <PackageEdit
          selectedPackage={props.selectedPackage}
          packageModalOpened={props.mode === 'edit'}
          onClosePackageModal={() => props.onModeChange('table')}
          onAddPackage={handleAddPackage}
          onEditPackage={handleEditPackage}
          onAddReagent={handleAddReagent}
          onBeginShownPackageEdit={() => handleBeginPackageEdit(props.selectedPackage!)}
          preFilledPackageData={props.preFilledPackageData}
        />
      </Modal>

      {/* Detalhamento de pkg */}
      <Drawer
        opened={props.mode === 'show'}
        onClose={() => props.onModeChange('table')}
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
            <PackageShow pkg={props.selectedPackage!} />
          </Tabs.Panel>
          <Tabs.Panel value="reagent">
            <ReagentShow reagent={selectedPackageReagent!} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>

      {/* Adicionar pkg */}
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
        <IoMdAdd size="20px" /> Cadastrar no estoque
      </Button>
    </>
  );
}
