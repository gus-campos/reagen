import { ReactNode, useState } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';

type ConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

export function ConfirmModal(props: ConfirmModalProps) {
  return (
    <Modal opened={props.opened} onClose={props.onClose} title="Confirmação" centered>
      <Text>{props.children}</Text>
      <Group mt="md" justify="end">
        <Button variant="default" onClick={props.onClose}>
          Cancelar
        </Button>
        <Button
          color="blue"
          onClick={() => {
            props.onConfirm();
            props.onClose();
          }}
        >
          Confirmar
        </Button>
      </Group>
    </Modal>
  );
}
