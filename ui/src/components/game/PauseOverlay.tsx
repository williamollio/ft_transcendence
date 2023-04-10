import { Backdrop, Button } from "@mui/material";
import React from "react";

interface Props {
  children?: JSX.Element;
  open: boolean;
}

export default function PauseOverlay(props: Props) {
  const { children, open } = props;

  return (
    <>
      <Backdrop
        onClick={() => {}}
        open={open}
        sx={{ position: "absolute", zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        {children}
      </Backdrop>
    </>
  );
}
