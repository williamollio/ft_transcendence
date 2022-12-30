import React, {ReactElement} from "react";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../interfaces/router.interface";
import {Box, Button, Grid, TextField} from "@material-ui/core";
import AuthService from "../service/auth.service";

export default function Login2FAView(): ReactElement {
    const navigate = useNavigate();

    async function handleSubmit() {
        let response = await AuthService.getAuthURI(); // <- Will be changed later on.
        if (!response?.error) {
            navigate(RoutePath.PROFILE);
        } else {
            navigate(RoutePath.LOGIN);
        }
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
            <Button onClick={() => handleSubmit()}>
                Submit
            </Button>
        </Box>
    );
}