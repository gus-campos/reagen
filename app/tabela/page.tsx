'use client';

import { useState } from 'react';
import { Button, Drawer, Menu, Modal, Table, TextInput, Select, Group, Grid, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

const rowsNames = ['Reagente', 'Quantidade', 'Unidade', 'Ações'];

enum Unit {
  GRAMS = 'gramas (g)',
  KILOGRAMS = 'kilogramas (Kg)',
  LITERS = 'litros (L)',
  UNITS = 'unidades (un.)'
}

const units = [
  {
    group: 'Massa',
    items: [ Unit.GRAMS, Unit.KILOGRAMS ],
  },
  {
    group: 'Volume',
    items: [ Unit.LITERS ],
  },
  {
    group: 'Outros',
    items: [ Unit.UNITS ],
  }
];

type ReagData = {
  name: string;
  amount: number;
  unit: Unit;
};


const initialReagsData: ReagData[] = [
  { name: 'Sulfeto de Bário', amount: 1.54, unit: Unit.GRAMS },
  { name: 'Cloreto de Sódio', amount: 44.6, unit: Unit.LITERS },
];

export default function TableView() {

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [addFormOpened, { open: openAddForm, close: closeAddForm }] = useDisclosure(false);

  const [reagsData, setReagsData] = useState<ReagData[]>(initialReagsData);

  const [search, setSearch] = useState('');

  const form = useForm<ReagData>({
    initialValues: {
      name: "",
      unit: Unit.GRAMS,
      amount: 0,
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'O nome não pode estar vazio'),
      //unit: (value) => (Object.values(Unit).includes(value) ? null : 'Unidade de medida inválida'),
      amount: (value) => (value > 0 ? ((form.values.unit != Unit.UNITS || value % 1 == 0) ? null : "Precisa ser inteiro") : 'Só é possível adicionar quantidade maior que 0')
    }
  });

  const handleSubmit = (reagData: ReagData) => {

    setReagsData([...reagsData, reagData]);
    closeAddForm();
    form.reset();
  }

  return (
    // Falta heading, barra lateral

    <>
      <Drawer title="Opções" opened={drawerOpened} onClose={closeDrawer}>
        <Menu>
          <Menu.Item>Tabela</Menu.Item>
          <Menu.Item>Inserir reagente</Menu.Item>
        </Menu>
      </Drawer>

      <TextInput value={search} onChange={(event) => setSearch(event.currentTarget.value)} />

      <Table
        data={{
          head: rowsNames,
          body: reagsData.filter((item) => item.name.includes(search.trim())).map((reag) => [reag.name, reag.amount, reag.unit]),
        }}
      />

      <Modal title={'Adicionar reagente'} opened={addFormOpened} onClose={closeAddForm}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            
            <Grid.Col span={{ base: 12 }}>
              <TextInput label="Nome" {...form.getInputProps('name')}></TextInput>
            </Grid.Col>
            
            <Grid.Col span={{ base: 6 }}>
              <NumberInput label="Quantidade" hideControls {...form.getInputProps('amount')} ></NumberInput>
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
              <Select label="Unidade" {...form.getInputProps('unit')} data={units}></Select>
            </Grid.Col>

          </Grid>

          <Group mt="xl" justify='right'>

            <Button type="submit">
              Adicionar
            </Button>
            
            <Button variant="outline" onClick={closeAddForm}>
              Cancelar
            </Button>
          
          </Group>
        </form>
        

      </Modal>

      <Button style={{ position: 'fixed', bottom: '20px', right: '20px' }} onClick={openAddForm}>
        +
      </Button>

      <Button
        style={{ position: 'fixed', bottom: '20px', left: '20px' }}
        variant="default"
        onClick={openDrawer}
      >
        Opções
      </Button>
    </>
  );
}
