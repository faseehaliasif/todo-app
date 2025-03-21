import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface ModelProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  editTodo: { id: string; title: string };
  updateTodo: { mutate: (data: { id: string; title: string }) => void };
}

const Model = ({ setOpen, editTodo, updateTodo }: ModelProps) => {
  const [updatedTitle, setUpdatedTitle] = useState(editTodo.title);

  return (
    <Dialog open={true} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
        </DialogHeader>

        <Input
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          className="mb-4"
        />

        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              updateTodo.mutate({ id: editTodo.id, title: updatedTitle });
              setOpen(false);
            }}
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Model;
