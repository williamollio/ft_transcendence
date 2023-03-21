import {
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { JoinDialogValue } from "../../interfaces/chat.interface";
import { translationKeys } from "../../views/Chat/constants";

interface Props {
  dialogJoinValue: JoinDialogValue;
  setDialogJoinValue: React.Dispatch<React.SetStateAction<JoinDialogValue>>;
  handleClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function JoinForm(props: Props) {
  const { dialogJoinValue, setDialogJoinValue, handleClose } = props;
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid item>
        <DialogTitle>{t(translationKeys.joinChannelTitle)}</DialogTitle>
      </Grid>
      <Grid item>
        <DialogContent>
          <Grid container spacing="20px">
            <Grid item>
              <DialogContentText>{t(translationKeys.joinChannelText)}</DialogContentText>
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                size="small"
                autoFocus
                id="name"
                value={dialogJoinValue.name}
                onChange={(event) =>
                  setDialogJoinValue({
                    ...dialogJoinValue,
                    name: event.target.value,
                  })
                }
                label={t(translationKeys.name)}
                type="text"
              />
            </Grid>
            <Grid item>
              <TextField
                size="small"
                id="password"
                value={dialogJoinValue.password}
                onChange={(event) =>
                  setDialogJoinValue({
                    ...dialogJoinValue,
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
          <Button type="submit">{t(translationKeys.join)}</Button>
        </DialogActions>
      </Grid>
    </Grid>
  );
}
