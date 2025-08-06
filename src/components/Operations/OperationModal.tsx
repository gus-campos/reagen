import { Box, Grid, Text, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { toNullableLocalDate } from '@/src/utils/date';
import { formattedDate } from '@/src/utils/formatted-date';
import { Operation, OperationType } from '../../models/operation';
import { DataModal } from '../Crud/Table/Modal/DataModal';

type OperationModalProps = {
  showMode: boolean;
  selectedOperation: Operation | null;
  operationModalOpened: boolean;
  onCloseOperationModal: () => void;
  onEditOperation: (selectedOperation: Operation) => void;
  onBeginShownOperationEdit: () => void;
};

export function OperationModal(props: OperationModalProps) {
  const form = useForm<Operation>({
    initialValues: {
      id: '',
      reagentId: '',
      date: new Date(),
      type: OperationType.CONSUMPTION,
      notes: '',
    },

    transformValues: (values) => ({
      ...values,
      date: toNullableLocalDate(values.date)!, // Só volta null quando vai null
    }),
  });

  return (
    <DataModal
      dataName="operation"
      form={form}
      modalOpened={props.operationModalOpened}
      onAddData={(operation: Operation) => {}}
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
              <Grid.Col span={{ base: 12 }} style={{ wordBreak: 'break-word' }}>
                <strong>Observações:</strong> {props.selectedOperation.notes ?? ''}
              </Grid.Col>
            </Grid>
          )}
        </Box>
      }
      editModeChildren={
        <Grid>
          <Grid.Col span={{ base: 12 }}>
            <TextInput label="Reagente" {...form.getInputProps('reagentId')}></TextInput>
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <DatePickerInput
              clearable
              valueFormat="DD/MM/YYYY"
              label="Entrada"
              placeholder="Selecione data"
              {...form.getInputProps('date')}
            ></DatePickerInput>
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <TextInput label="Observações" {...form.getInputProps('notes')}></TextInput>
          </Grid.Col>
        </Grid>
      }
    />
  );
}
