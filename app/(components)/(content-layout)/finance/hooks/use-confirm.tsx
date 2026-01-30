import { JSX, useState } from "react";

import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";

export const useConfirm = (
  title: string,
  message: string,
): [() => JSX.Element, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent className="bg-white text-black border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-black">{title}</DialogTitle>
          <DialogDescription className="text-black">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2 flex gap-2">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="bg-white text-black border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-black text-white hover:bg-gray-800"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
