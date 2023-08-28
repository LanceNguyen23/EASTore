import { Button } from "../ui/button";
import Modal from "../ui/modal";

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div>
      <Modal
        title="Are you sure? 🤔"
        desc="This action can't be undone"
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Yes</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AlertModal;
