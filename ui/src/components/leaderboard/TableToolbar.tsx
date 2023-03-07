import { TextField, Toolbar } from "@mui/material";
import { useState } from "react";

interface Props {
  filter: (filterValue: string) => void;
}

export default function TableToolbar(props: Props) {
  const { filter } = props;

  const [value, setValue] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      filter(value);
    }
	setValue("");
  };

  return (
    <Toolbar>
      <TextField
        sx={{ marginLeft: "auto" }}
        value={value}
        onChange={handleChange}
        onKeyDown={handleSubmit}
      ></TextField>
    </Toolbar>
  );
}
