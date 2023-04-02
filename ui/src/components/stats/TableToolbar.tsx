import { TextField, Toolbar } from "@mui/material";
import { useState } from "react";
import { translationKeys } from "../../views/Stats/constants";
import { useTranslation } from "react-i18next";

interface Props {
  filter: (filterValue: string) => void;
}

export default function TableToolbar(props: Props) {
  const { filter } = props;
  const { t } = useTranslation();

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
        label={t(translationKeys.filter)}
        value={value}
        onChange={handleChange}
      ></TextField>
    </Toolbar>
  );
}
