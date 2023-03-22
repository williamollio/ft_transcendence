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
import { makeStyles } from "tss-react/mui";
import { useTranslation } from "react-i18next";
import { JoinDialogValue } from "../../interfaces/chat.interface";
import { translationKeys } from "./constants";

interface Props {
  dialogJoinValue: JoinDialogValue;
  setDialogJoinValue: React.Dispatch<React.SetStateAction<JoinDialogValue>>;
  handleClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function JoinForm(props: Props) {
  const { dialogJoinValue, setDialogJoinValue, handleClose } = props;
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <Grid container>
      <Grid item>
        <DialogTitle>{t(translationKeys.joinChannelTitle)}</DialogTitle>
      </Grid>
      <Grid item>
        <DialogContent>
          <Grid container spacing="20px">
            <Grid item>
              <DialogContentText>
                {t(translationKeys.joinChannelText)}
              </DialogContentText>
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Grid>
      <Grid item>
        <DialogActions>
          <Button
            type="submit"
            className={classes.iconButton}
            variant="contained"
            color="primary"
          >
            {t(translationKeys.buttons.join)}
          </Button>
          <Button
            onClick={handleClose}
            className={classes.iconButton}
            variant="outlined"
          >
            {t(translationKeys.buttons.cancel)}
          </Button>
        </DialogActions>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles()(() => ({
  iconButton: {
    height: "30%",
    width: "30%",
  },
}));
