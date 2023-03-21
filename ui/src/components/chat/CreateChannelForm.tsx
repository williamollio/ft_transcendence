import {
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { CRDialogValue } from "../../interfaces/chat.interface";
import { translationKeys } from "../../views/Chat/constants";

interface Props {
  dialogValue: CRDialogValue;
  setDialogValue: Dispatch<SetStateAction<CRDialogValue>>;
  handleClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CreateForm(props: Props) {
  const { dialogValue, setDialogValue, handleClose } = props;
  const [pwDisable, setPwDisable] = useState<boolean>(true);
  const { t } = useTranslation();

  const handleAccessChange = (e: any) => {
    let tmpCR: CRDialogValue = { ...dialogValue, access: e.target.value };
    if (tmpCR.access !== "PROTECTED") {
      tmpCR.password = "";
      setPwDisable(true);
    } else setPwDisable(false);
    setDialogValue(tmpCR);
  };

  return (
    <Grid container>
      <Grid item>
        <DialogTitle>{t(translationKeys.createChannelTitle)}</DialogTitle>
      </Grid>
      <Grid item>
        <DialogContent>
          <Grid container spacing="20px">
            <Grid item>
              <DialogContentText>
                {t(translationKeys.createChannelText)}
              </DialogContentText>
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                size="small"
                autoFocus
                id="name"
                value={dialogValue.key}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    key: event.target.value,
                  })
                }
                label={t(translationKeys.name)}
                type="text"
              />
            </Grid>
            <Grid item>
              <Select
                size="small"
                label={t(translationKeys.access)}
                type="string"
                variant="outlined"
                value={dialogValue.access}
                onChange={handleAccessChange}
              >
                <MenuItem value="PUBLIC">{t(translationKeys.public)}</MenuItem>
                <MenuItem value="PRIVATE">
                  {t(translationKeys.private)}
                </MenuItem>
                <MenuItem value="PROTECTED">
                  {t(translationKeys.protected)}
                </MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <TextField
                size="small"
                disabled={pwDisable}
                id="password"
                value={dialogValue.password}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    password: event.target.value,
                  })
                }
                label={t(translationKeys.password)}
                type="password"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Grid>
      <Grid item>
        <DialogActions>
          <Button onClick={handleClose}>{t(translationKeys.cancel)}</Button>
          <Button type="submit">{t(translationKeys.add)}</Button>
        </DialogActions>
      </Grid>
    </Grid>
  );
}
