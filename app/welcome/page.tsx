'use client'

import { Drawer, Menu, Button, Table, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

const rows = ["Reagente", "Peso (g)"];

const data = [
  ["Sulfeto de Bário", 1.54],
  ["Cloreto de Sódio", 44.6 ]
];

export default function TableView() {

  const [opened, {open, close}] = useDisclosure(true);
  const [search, setSearch] = useState("");

  return (
    <>

      <Drawer title="Opções" opened={opened} onClose={close}>
        <Menu>
          <Menu.Item>Tabela</Menu.Item>
          <Menu.Item>Inserir reagente</Menu.Item>
        </Menu>
      </Drawer>

      <TextInput value={search} onChange={(event) => setSearch(event.currentTarget.value)}/>

      <Table data={{ head: rows, body: data }} />

      <Button variant='default' onClick={open}> 
        Opções 
      </Button>
    </>
  );
}