import { ReactNode } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { useConfirmModal } from '@/shared/components/confirm-modal.viewmodel';

type ConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

export function ConfirmModal(props: ConfirmModalProps) {
  const { handleConfirmAndClose } = useConfirmModal(props);

  return (
    <Modal opened={props.opened} onClose={props.onClose} title="AVISO" centered>
      <Text style={{ whiteSpace: 'pre-line' }}>{props.children}</Text>
      <Group mt="md" justify="end">
        <Button variant="default" onClick={props.onClose}>
          Cancelar
        </Button>
        <Button color="red" onClick={handleConfirmAndClose}>
          Confirmar
        </Button>
      </Group>
    </Modal>
  );
}
