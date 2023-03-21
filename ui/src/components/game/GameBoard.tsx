import { Box, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GameLoop } from "../../classes/GameLoop.class";
import { positionalData } from "../../classes/positionalData.class";
import Ball from "./Ball";
import Player from "./Player";

interface Props {
  gameLoop: GameLoop;
}

export default function GameBoard(props: Props) {
  const { gameLoop } = props;

  const boardRef = useRef<HTMLDivElement>(null);

  const playerMoveHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (!gameLoop.keyPressed.some((element) => element === event.key))
        gameLoop.keyPressed.push(event.key);
    }
  };

  const playerStopHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      let index = gameLoop.keyPressed.findIndex(
        (element) => element === event.key
      );
      if (index !== -1) gameLoop.keyPressed.splice(index, 1);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", playerMoveHandler);
    document.addEventListener("keyup", playerStopHandler);
    return () => {
      document.removeEventListener("keydown", playerMoveHandler);
      document.removeEventListener("keyup", playerStopHandler);
    };
  }, [gameLoop]);

  return (
    <>
      <Paper
        ref={boardRef}
        sx={{
          width: 600,
          height: 450,
          backgroundColor: "white",
          display: "flex",
        }}
      >
        {/* <Box sx={{ backgroundColor: "black", height: "100%", width: "50%", opacity: 2}} /> */}
        <Box sx={{ backgroundColor: "blue", height: "50%", width: "100%" }} />
        <Player
          lr={true}
          yStart={gameLoop.positionalData.playerLeftYStart}
          yPos={gameLoop.positionalData.playerLeftYOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Player
          lr={false}
          yStart={gameLoop.positionalData.playerRightYStart}
          yPos={gameLoop.positionalData.playerRightYOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Ball
          ballStart={gameLoop.positionalData.ballPosStart}
          ballPos={gameLoop.positionalData.ballOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Ball>
      </Paper>
    </>
  );
}
