import { Paper } from "@mui/material";
import { GameConstants } from "../../interfaces/game.interface";

interface Props {
  yPos: number;
  lr: boolean;
  posRef: { offsetLeft: number; offsetTop: number };
  gameConstants: GameConstants;
}

export default function Player(props: Props) {
  const { yPos, posRef, lr, gameConstants } = props;

  return (
    <>
      {posRef.offsetLeft !== 0 && posRef.offsetTop != 0 ? (
        <Paper
          elevation={5}
          sx={{
            position: "absolute",
            top: posRef.offsetTop + yPos,
            ...(lr
              ? {
                  left:
                    gameConstants.paddleRelativeOffset -
                    gameConstants.paddleWidth +
                    posRef.offsetLeft,
                }
              : {
                  left:
                    gameConstants.boardWidth -
                    gameConstants.paddleRelativeOffset +
                    posRef.offsetLeft,
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
      ) : (
        false
      )}
    </>
  );
}
