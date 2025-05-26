import { Drawer, Menu } from '@mantine/core';

type SideDrawerProps = {
  drawerOpened: boolean;
  closeDrawer: () => void;
  openReagentModal: () => void;
};

export default function SideDrawer({
  drawerOpened,
  closeDrawer,
  openReagentModal,
}: SideDrawerProps) {
  return (
    <Drawer title="Opções" opened={drawerOpened} onClose={closeDrawer}>
      <Menu>
        <Menu.Item>Estoque</Menu.Item>
        <Menu.Item
          onClick={() => {
            openReagentModal();
            closeDrawer();
          }}
        >
          Adicionar reagentente
        </Menu.Item>
      </Menu>
    </Drawer>
  );
}
