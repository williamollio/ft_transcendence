import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import authService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../../interfaces/router.interface";
import { Cookie } from "../../utils/auth-helper";
import { BigSocket } from "../../classes/BigSocket.class";
import Banner from "../../components/Login/Banner";
import GoogleButton from "react-google-button";
import BannerBlock from "../../components/Login/BannerBlock";

interface Props {
  bigSocket: BigSocket;
}

export default function LoginView(props: Props): React.ReactElement {
  const { bigSocket } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isDesktop, setDesktop] = React.useState(window.innerWidth > 1200);

  React.useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  React.useEffect(() => {
    const token = localStorage.getItem(Cookie.TOKEN);
    if (token !== null) {
      navigate(RoutePath.EDITPROFILE);
    }
    if (bigSocket.socket.connected) bigSocket.logOut();
    setIsLoading(false);
  }, []);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 1200);
  };

  const handleLogin42 = () => {
    window.open(authService.getAuth42URI(), "_self");
  };

  const handleLoginGoogle = () => {
    window.open(authService.getAuthGoogleURI(), "_self");
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
          {isDesktop ? <Banner /> : <BannerBlock />}
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
          <Typography fontWeight="bold" fontSize={12}>
            {t(translationKeys.or)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "22rem",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <GoogleButton
              onClick={() => {
                handleLoginGoogle();
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
}
