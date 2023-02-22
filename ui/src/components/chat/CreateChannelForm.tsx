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
import { chatRoom } from "../../classes/chatRoom.class";

export default function CreateForm({
  dialogValue,
  setDialogValue,
  handleClose,
}: {
  dialogValue: any;
  setDialogValue: any;
  handleClose: any;
}) {
  const [pwDisable, setPwDisable] = useState<boolean>(true);

  const handleAccessChange = (e: any) => {
    let tmpCR: chatRoom = { ...dialogValue, access: e.target.value };
    if (tmpCR.access !== "PROTECTED") {
      tmpCR.password = "";
      setPwDisable(true);
    } else setPwDisable(false);
    setDialogValue(tmpCR);
  };

  return (
    <Grid container>
      <Grid item>
        <DialogTitle>Create new channel</DialogTitle>
      </Grid>
      <Grid item>
        <DialogContent>
          <Grid container spacing="20px">
            <Grid item>
              <DialogContentText>
                Please enter channel name, accessibility and password.
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
                label="name"
                type="text"
              />
            </Grid>
            <Grid item>
              <Select
                size="small"
                label="access"
                type="string"
                variant="outlined"
                value={dialogValue.access}
                onChange={handleAccessChange}
              >
                <MenuItem value="PUBLIC">public</MenuItem>
                <MenuItem value="PRIVATE">private</MenuItem>
                <MenuItem value="PROTECTED">protected</MenuItem>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Grid>
    </Grid>
  );
}
