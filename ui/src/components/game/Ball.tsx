import { Avatar } from "@mui/material";
import { GameConstants, ballPosition } from "../../interfaces/game.interface";

interface Props {
  ballPos: ballPosition;
  posRef: { offsetLeft: number; offsetTop: number };
  gameConstants: GameConstants;
}

export default function Ball(props: Props) {
  const { posRef, ballPos, gameConstants } = props;

  return (
    <>
      {posRef.offsetLeft !== 0 && posRef.offsetTop != 0 ? (
        <Avatar
          src="ball.png"
          sx={{
            position: "absolute",
            left: ballPos.x + posRef.offsetLeft,
            top: ballPos.y + posRef.offsetTop,
            boxShadow: 5,
            width: gameConstants.ballSize,
            height: gameConstants.ballSize,
          }}
        />
      ) : (
        false
      )}
    </>
  );
}
