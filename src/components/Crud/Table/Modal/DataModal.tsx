import React, { ReactNode, useEffect } from 'react';
import { Box, Button, Group, Modal } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

type ItemModalProps<T> = {
  showMode: boolean;
  selectedData: T | null;
  modalOpened: boolean;
  showModeChildren: ReactNode;
  editModeChildren: ReactNode;
  dataName: string;
  form: UseFormReturnType<T>;
  onCloseModal: () => void;
  onAddData: (data: T) => void;
  onEditData: (selectedData: T) => void;
  onBeginShownDataEdit: () => void;
};

export function DataModal<T>(props: ItemModalProps<T>) {
  const handleSubmit = (data: T) => {
    props.onCloseModal();

    if (props.selectedData) props.onEditData(data);
    else props.onAddData(data);
    props.form.reset();
  };

  useEffect(() => {
    if (props.selectedData) props.form.setValues(props.selectedData);
    else props.form.reset();
  }, [props.selectedData]);

  return (
    <Modal
      title={
        <strong>
          {props.showMode
            ? `Ficha ${props.dataName}`
            : props.selectedData
              ? `Editar ${props.dataName}`
              : `Adicionar ${props.dataName}`}
        </strong>
      }
      opened={props.modalOpened}
      onClose={props.onCloseModal}
    >
      {props.showMode && props.selectedData ? (
        <Box
          style={{
            padding: '10px',
          }}
        >
          {props.showModeChildren}
        </Box>
      ) : (
        <form>{props.editModeChildren}</form>
      )}
      <Group mt="xl" justify="right">
        {props.showMode ? (
          <Button onClick={props.onBeginShownDataEdit}>Editar</Button>
        ) : (
          <Button
            onClick={() => {
              props.form.onSubmit(handleSubmit)();
            }}
          >
            {props.selectedData ? 'Salvar' : 'Adicionar'}
          </Button>
        )}
        <Button variant="outline" onClick={props.onCloseModal}>
          Cancelar
        </Button>
      </Group>
    </Modal>
  );
}
