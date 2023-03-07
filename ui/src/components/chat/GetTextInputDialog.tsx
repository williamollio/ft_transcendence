import { Dialog, DialogContent, TextField } from "@mui/material";
import {
  KeyboardEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface Props {
  open: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (input: string) => void;
  dialogContent?: string;
  label: string;
  type: string;
}

export default function GetTextInputDialog(props: Props) {
  const { open, toggleOpen, handleSubmit, dialogContent, label, type } = props;

  const [input, setInput] = useState<string>("");

  const handleClose = () => {
    toggleOpen(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
          handleSubmit(input);
          handleClose();
        }
      }}
    >
      {dialogContent ? <DialogContent>{dialogContent}</DialogContent> : false}
      <TextField
        label={label}
        type={type}
        value={input}
        onChange={handleChange}
      ></TextField>
    </Dialog>
  );
}
