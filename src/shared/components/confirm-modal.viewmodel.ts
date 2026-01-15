type ConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function useConfirmModal(props: ConfirmModalProps) {
  const handleConfirmAndClose = () => {
    props.onConfirm();
    props.onClose();
  };

  return {
    handleConfirmAndClose,
  };
}
