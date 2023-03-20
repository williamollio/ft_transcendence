import { Avatar } from "@mui/material";

interface Props {
  ballPos: { x: number; y: number };
  posRef: { offsetLeft: number; offsetTop: number };
}

export default function Ball(props: Props) {
  const { posRef, ballPos } = props;

  return (
    <>
      {posRef.offsetLeft !== 0 && posRef.offsetTop != 0 ? (
        <Avatar
          src=""
          sx={{
            width: 30,
            height: 30,
            position: "absolute",
            left: ballPos.x + posRef.offsetLeft,
            top: ballPos.y + posRef.offsetTop,
          }}
        />
      ) : (
        false
      )}
    </>
  );
}
