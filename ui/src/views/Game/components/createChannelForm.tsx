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

export const createForm = ({ dialogValue, setDialogValue, handleAccessChange, pwDisable, handleClose }: { dialogValue: any, setDialogValue: any, handleAccessChange: any, pwDisable: any, handleClose: any }) => {
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
                <MenuItem value="public">public</MenuItem>
                <MenuItem value="private">private</MenuItem>
                <MenuItem value="password">password</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <TextField
                size="small"
                disabled={pwDisable}
                id="name"
                value={dialogValue.password}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    password: event.target.value,
                  })
                }
                label="password"
                type="string"
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
};
