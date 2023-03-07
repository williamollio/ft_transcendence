import {
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export default function JoinForm({
  dialogJoinValue,
  setDialogJoinValue,
  handleClose,
}: {
  dialogJoinValue: any;
  setDialogJoinValue: any;
  handleClose: any;
}) {
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Join</Button>
        </DialogActions>
      </Grid>
    </Grid>
  );
}
