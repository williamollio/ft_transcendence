import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Banner = () => {
  const [isBannerAccepted, setIsBannerAccepted] =
    React.useState<boolean>(false);

  function acceptBanner() {
    setIsBannerAccepted(true);
  }

  return (
    <>
      {isBannerAccepted ? (
        <></>
      ) : (
        <>
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "30%",
              top: "0",
              backgroundColor: "#D3D3D3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: 4,
            }}
          >
            <Box
              sx={{
                textAlign: "justify",
                height: "100%",
                width: "100%",
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "2rem",
              }}
            >
              <Box>
                <Typography variant="body1">
                  This application was created for educational purposes only and
                  is not intended for :
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="body1">
                    - Production use
                    <br />
                    - Security
                    <br />
                    - Bug-free operation
                    <br />
                    - Responsiveness
                    <br />- Aesthetic design
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  margin: "1rem 0",
                }}
              >
                <Typography variant="body2">
                  If you encounter a 500 error while attempting to log in,
                  please reach out to the{" "}
                  <a
                    href="https://github.com/williamollio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      maintainer
                    </span>
                  </a>.
                </Typography>
              </Box>
              <Typography variant="body2">
                You can access the source code at the following{" "}
                <a
                  href="https://github.com/williamollio/ft_transcendence"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    link
                  </span>
                </a>.
              </Typography>

              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "blue",
                  alignSelf: "center",
                  marginTop: "2rem",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    acceptBanner();
                  }}
                >
                  ok
                </Button>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: "0",
              backgroundColor: "#D3D3D3",
              opacity: "0.5",
              zIndex: 2,
            }}
          ></Box>
        </>
      )}
    </>
  );
};

export default Banner;
