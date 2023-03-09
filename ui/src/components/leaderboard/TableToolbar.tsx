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
    filter(event.target.value);
  };

  return (
    <Toolbar>
      <TextField
        sx={{ marginLeft: "auto" }}
        size="small"
		value={value}
        onChange={handleChange}
      ></TextField>
    </Toolbar>
  );
}
