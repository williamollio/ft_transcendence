import React from "react";
import { Box, Typography } from "@mui/material";

const BannerBlock = () => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          backgroundColor: "#D3D3D3",
          opacity: "0.5",
          padding: "0",
          margin: "0",
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
            paddingTop: "2rem",
          }}
        >
          <Box>
            <Typography variant="body1">
              Please use a wider screen to access the fttranscendence app
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BannerBlock;
