import React, {ReactElement} from "react";
import {useNavigate} from "react-router-dom";
import {RoutePath} from "../interfaces/router.interface";
import {Box, Button, Grid, TextField} from "@material-ui/core";

export default function Login2FAView(): ReactElement {
    const navigate = useNavigate();

    const handleSubmit = () => {
        /*
         * const response = somehow_call_the_backend();
         * if (response.success) {
         *   navigate(RoutePath.PROFILE);
         * } else {
         */
        navigate(RoutePath.LOGIN);
        // }
    };

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