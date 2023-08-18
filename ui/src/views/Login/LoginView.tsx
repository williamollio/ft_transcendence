import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import { Cookie } from "../../utils/auth-helper";
import { BigSocket } from "../../classes/BigSocket.class";
import Banner from "../../components/Login/Banner";

interface Props {
  bigSocket: BigSocket;
}

export default function LoginView(props: Props): React.ReactElement {
  const { bigSocket } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const token = localStorage.getItem(Cookie.TOKEN);
    if (token !== null) {
      navigate(RoutePath.EDITPROFILE);
    }
    if (bigSocket.socket.connected) bigSocket.logOut();
    setIsLoading(false);
  }, []);

  const handleLogin42 = () => {
    window.open(authService.getAuthURI(), "_self");
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3rem",
          }}
        >
          <Banner />
          <Box
            sx={{
              display: "flex",
              width: "22rem",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Button
              sx={{ width: "190px", height: "45px" }}
              variant="contained"
              onClick={() => handleLogin42()}
            >
              {t(translationKeys.buttons.login42)}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
