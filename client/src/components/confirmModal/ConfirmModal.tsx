import { Modal, Button } from "antd";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
}: ConfirmModalProps) => {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {cancelText}
        </Button>,
        <Button key="confirm" type="primary" danger onClick={onConfirm}>
          {confirmText}
        </Button>,
      ]}
    >
      <p>{description}</p>
    </Modal>
  );
};
