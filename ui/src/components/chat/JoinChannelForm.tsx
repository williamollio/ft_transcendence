import {
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";

export default function JoinForm({
  dialogJoinValue,
  setDialogJoinValue,
  handleClose,
}: {
  dialogJoinValue: any;
  setDialogJoinValue: any;
  handleClose: any;
}) {
  const { classes } = useStyles();
  const { t } = useTranslation();
  return (
    <Grid container>
      <Grid item>
        <DialogTitle>Join existing channel</DialogTitle>
      </Grid>
      <Grid item>
        <DialogContent>
          <Grid container spacing="20px">
            <Grid item>
              <DialogContentText>
                Please enter the id and password of the channel you want to
                Join.
              </DialogContentText>
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                size="small"
                autoFocus
                id="id"
                value={dialogJoinValue.id}
                onChange={(event) =>
                  setDialogJoinValue({
                    ...dialogJoinValue,
                    id: event.target.value,
                  })
                }
                label="id"
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
                label="password"
                type="password"
                variant="outlined"
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
