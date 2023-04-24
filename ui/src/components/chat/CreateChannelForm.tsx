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
import { useState } from "react";
import { CRDialogValue } from "../../interfaces/chat.interface";
import { makeStyles } from "tss-react/mui";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";

interface Props {
  dialogValue: CRDialogValue;
  setDialogValue: React.Dispatch<React.SetStateAction<CRDialogValue>>;
  handleClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CreateForm(props: Props) {
  const { dialogValue, setDialogValue, handleClose } = props;
  const [pwDisable, setPwDisable] = useState<boolean>(true);
  const { t } = useTranslation();
  const { classes } = useStyles();

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
        <DialogTitle>
          {t(translationKeys.createInfo.createChannelTitle)}
        </DialogTitle>
      </Grid>
      <Grid item>
        <DialogContent>
          <Grid container spacing="20px">
            <Grid item>
              <DialogContentText>
                {t(translationKeys.createInfo.createChannelText)}
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
                label={t(translationKeys.createInfo.name)}
                type="text"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item>
              <Select
                MenuProps={{sx: {zIndex : 99999, position: "absolute"}}}
                size="small"
                type="string"
                variant="outlined"
                value={dialogValue.access}
                onChange={handleAccessChange}
              >
                <MenuItem value="PUBLIC">
                  {t(translationKeys.createInfo.public)}
                </MenuItem>
                <MenuItem value="PRIVATE">
                  {t(translationKeys.createInfo.private)}
                </MenuItem>
                <MenuItem value="PROTECTED">
                  {t(translationKeys.createInfo.protected)}
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
                label={t(translationKeys.createInfo.password)}
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
            {t(translationKeys.buttons.add)}
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
