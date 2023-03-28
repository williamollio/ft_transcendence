import { Avatar } from "@mui/material";
import { ballPosition } from "../../interfaces/game.interface";

interface Props {
  ballPos: ballPosition;
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
            position: "absolute",
            left: ballPos.x + posRef.offsetLeft,
            top: ballPos.y + posRef.offsetTop,
            boxShadow: 5,
            width: 30,
            height: 30,
          }}
        />
      ) : (
        false
      )}
    </>
  );
}
