import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./dialog";

interface ModalProps {
  title: string;
  desc: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  desc,
  isOpen,
  onClose,
  children,
}) => {
  const onChange = () => {
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
