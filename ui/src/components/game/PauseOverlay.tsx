import { Backdrop } from "@mui/material";
import React from "react";

interface Props {
	children?: JSX.Element;
	open: boolean;
	toggleOverlay?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PauseOverlay(props: Props) {
  const {children, open} = props;

  return (
    <Backdrop open={open} sx={{ position: "absolute", zIndex: 10 }}>
		{children}
	</Backdrop>
  );
}
