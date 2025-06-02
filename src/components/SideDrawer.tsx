import { Drawer, Menu } from '@mantine/core';

type SideDrawerProps = {
  drawerOpened: boolean;
  closeDrawer: () => void;
};

export default function SideDrawer({ drawerOpened, closeDrawer }: SideDrawerProps) {
  return (
    <Drawer title="Opções" opened={drawerOpened} onClose={closeDrawer}>
      <Menu>
        <Menu.Item>Estoque</Menu.Item>
      </Menu>
    </Drawer>
  );
}
