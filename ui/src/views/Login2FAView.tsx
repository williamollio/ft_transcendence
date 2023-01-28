import React, { ReactElement } from "react";
import { Box, Button, Grid, TextField } from "@material-ui/core";

export default function Login2FAView(): ReactElement {
  async function handleSubmit() {
    // TODO: New strategy!
    //          - mhahnFr
    /*let response = await AuthService.getAuthURI(); // <- Will be changed later on.
    if (!response?.error) {
      navigate(RoutePath.PROFILE);
    } else {
      navigate(RoutePath.LOGIN);
    }*/
  }

  return (
    <Box className="default">
      <Grid alignItems={"stretch"}>
        <TextField></TextField>
        <TextField></TextField>
        <TextField></TextField>
        <TextField></TextField>
        <TextField></TextField>
        <TextField></TextField>
      </Grid>
      <Button onClick={() => handleSubmit()}>Submit</Button>
    </Box>
  );
}
