import { Paper } from "@mui/material";
import { GameConstants } from "../../interfaces/game.interface";

interface Props {
  yPos: number;
  lr: boolean;
  gameConstants: GameConstants;
}

export default function Player(props: Props) {
  const { yPos, lr, gameConstants } = props;

  return (
    <>
      <Paper
        elevation={5}
        sx={{
          position: "absolute",
          top: yPos,
          ...(lr
            ? {
                left:
                  gameConstants.paddleRelativeOffset -
                  gameConstants.paddleWidth
              }
            : {
                left:
                  gameConstants.boardWidth -
                  gameConstants.paddleRelativeOffset
              }),
          ...(!lr
            ? {
                backgroundColor: "black",
              }
            : false),
          width: gameConstants.paddleWidth,
          height: gameConstants.paddleSize,
        }}
      />
    </>
  );
}
