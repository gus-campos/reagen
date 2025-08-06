import { Box, Grid, Select, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { Reagent } from '@/src/models/reagent';
import { useData } from '@/src/providers/DataProvider';
import { toNullableLocalDate } from '@/src/utils/date';
import { formattedDate } from '@/src/utils/formatted-date';
import { Operation, OperationType } from '../../models/operation';
import { DataModal } from '../Crud/Table/Modal/DataModal';

type OperationModalProps = {
  reagent: Reagent;
  showMode: boolean;
  selectedOperation: Operation | null;
  operationModalOpened: boolean;
  onAddOperation: (operation: Operation) => void;
  onCloseOperationModal: () => void;
  onEditOperation: (selectedOperation: Operation) => void;
  onBeginShownOperationEdit: () => void;
};

export function OperationModal(props: OperationModalProps) {
  const form = useForm<Operation>({
    initialValues: {
      id: '[NULL]',
      reagentId: props.reagent.id,
      date: new Date(),
      type: OperationType.CONSUMPTION,
      notes: '',
    },
    validate: (values) => ({
      date: isNotEmpty('Campo obrigatório')(values.date),
      from:
        values.type === OperationType.TRANSFER
          ? isNotEmpty('Campo obrigatório')(values.from)
          : null,
      to:
        values.type === OperationType.TRANSFER ? isNotEmpty('Campo obrigatório')(values.to) : null,
      source:
        values.type === OperationType.INPUT ? isNotEmpty('Campo obrigatório')(values.source) : null,
    }),

    transformValues: (values) => ({
      ...values,
      date: toNullableLocalDate(values.date)!, // Só volta null quando vai null
    }),
  });

  return (
    <DataModal
      dataName="operação"
      form={form}
      modalOpened={props.operationModalOpened}
      onAddData={props.onAddOperation}
      onCloseModal={props.onCloseOperationModal}
      onEditData={props.onEditOperation}
      onBeginShownDataEdit={props.onBeginShownOperationEdit}
      showMode={props.showMode}
      selectedData={props.selectedOperation}
      showModeChildren={
        <Box
          style={{
            padding: '10px',
          }}
        >
          {props.selectedOperation && (
            <Grid>
              <Grid.Col span={{ base: 12 }}>
                <strong>Reagente:</strong> {props.selectedOperation.reagentId}
              </Grid.Col>
              <Grid.Col span={{ base: 12 }}>
                <strong>Data:</strong> {formattedDate(props.selectedOperation.date)}
              </Grid.Col>
              <Grid.Col span={{ base: 12 }}>
                <strong>Tipo:</strong> {props.selectedOperation.type}
              </Grid.Col>
              <Grid.Col span={{ base: 12 }} style={{ wordBreak: 'break-word' }}>
                <strong>Observações:</strong> {props.selectedOperation.notes ?? ''}
              </Grid.Col>
              {props.selectedOperation.type === OperationType.TRANSFER && (
                <>
                  <Grid.Col span={{ base: 12 }} style={{ wordBreak: 'break-word' }}>
                    <strong>De:</strong> {props.selectedOperation.from}
                  </Grid.Col>
                  <Grid.Col span={{ base: 12 }} style={{ wordBreak: 'break-word' }}>
                    <strong>Para:</strong> {props.selectedOperation.to}
                  </Grid.Col>
                </>
              )}
              {props.selectedOperation.type === OperationType.INPUT && (
                <>
                  <Grid.Col span={{ base: 12 }} style={{ wordBreak: 'break-word' }}>
                    <strong>Fonte:</strong> {props.selectedOperation.source}
                  </Grid.Col>
                </>
              )}
            </Grid>
          )}
        </Box>
      }
      editModeChildren={
        <Grid>
          <Grid.Col span={{ base: 12 }}>
            <DatePickerInput
              clearable
              valueFormat="DD/MM/YYYY"
              label="Data"
              placeholder="Selecione data"
              {...form.getInputProps('date')}
            ></DatePickerInput>
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Select
              label="Tipo"
              clearable={false}
              data={Object.values(OperationType)}
              allowDeselect={false}
              {...form.getInputProps('type')}
            ></Select>
          </Grid.Col>

          {/* TODO: Adicionar holders */}
          {form.values.type === OperationType.TRANSFER && (
            <>
              <Grid.Col span={{ base: 6 }}>
                <TextInput label="Fonte" {...form.getInputProps('from')}></TextInput>
              </Grid.Col>
              <Grid.Col span={{ base: 6 }}>
                <TextInput label="Destino" {...form.getInputProps('to')}></TextInput>
              </Grid.Col>
            </>
          )}

          {/* Adicionar fontes de recursos */}
          {form.values.type === OperationType.INPUT && (
            <>
              <Grid.Col span={{ base: 12 }}>
                <TextInput label="Origem" {...form.getInputProps('source')}></TextInput>
              </Grid.Col>
            </>
          )}

          <Grid.Col span={{ base: 12 }}>
            <TextInput label="Observações" {...form.getInputProps('notes')}></TextInput>
          </Grid.Col>
        </Grid>
      }
    />
  );
}
