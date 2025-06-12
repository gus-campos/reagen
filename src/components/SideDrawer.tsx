'use client';

import { useRouter } from 'next/navigation';
import { Button, Drawer, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function SideDrawer() {
  const router = useRouter();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <>
      <Button
        style={{ position: 'fixed', bottom: '20px', left: '20px' }}
        variant="default"
        onClick={openDrawer}
      >
        <strong>Opções</strong>
      </Button>

      <Drawer title="Opções" opened={drawerOpened} onClose={closeDrawer}>
        <Menu>
          <Menu.Item
            onClick={() => {
              closeDrawer();
              router.push('/');
            }}
          >
            <strong>Página inicial</strong>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              closeDrawer();
              router.push('/estoque');
            }}
          >
            <strong>Estoque</strong>
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
}
