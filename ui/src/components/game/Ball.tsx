import { Avatar } from "@mui/material";
import { GameConstants, ballPosition } from "../../interfaces/game.interface";

interface Props {
  ballPos: ballPosition;
  gameConstants: GameConstants;
}

export default function Ball(props: Props) {
  const { ballPos, gameConstants } = props;

  return (
    <>
      <Avatar
        src="ball.png"
        sx={{
          position: "absolute",
          left: ballPos.x,
          top: ballPos.y,
          boxShadow: 5,
          width: gameConstants.ballSize,
          height: gameConstants.ballSize,
        }}
      />
    </>
  );
}
