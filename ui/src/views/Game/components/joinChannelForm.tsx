import {
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export const joinForm = ({dialogJoinValue: {key: string, password?: string}, setDialogJoinValue: any, handleClose: any}) => {
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
                Please enter the name and password of the channel you want to
                Join.
              </DialogContentText>
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                size="small"
                autoFocus
                id="name"
                value={dialogJoinValue.key}
                onChange={(event) =>
                  setDialogJoinValue({
                    ...dialogJoinValue,
                    key: event.target.value,
                  })
                }
                label="name"
                type="text"
              />
            </Grid>
            <Grid item>
              <TextField
                size="small"
                id="name"
                value={dialogJoinValue.password}
                onChange={(event) =>
                  setDialogJoinValue({
                    ...dialogJoinValue,
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
          <Button type="submit">Join</Button>
        </DialogActions>
      </Grid>
    </Grid>
  );
};
