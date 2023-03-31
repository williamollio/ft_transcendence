import { Paper } from "@mui/material";

interface Props {
  yPos: number;
  lr: boolean;
  posRef: { offsetLeft: number; offsetTop: number };
}

export default function Player(props: Props) {
  const { yPos, posRef, lr } = props;

  return (
    <>
      {posRef.offsetLeft !== 0 && posRef.offsetTop != 0 ? (
        <Paper
          elevation={5}
          sx={{
            position: "absolute",
            top: posRef.offsetTop + yPos,
            ...(lr
              ? { left: 10 + posRef.offsetLeft }
              : { left: 642 + posRef.offsetLeft }),
            ...(!lr
              ? {
                  backgroundColor: "black",
                }
              : false),
            width: 20,
            height: 100,
          }}
        />
      ) : (
        false
      )}
    </>
  );
}