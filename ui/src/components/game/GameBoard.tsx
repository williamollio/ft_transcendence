import { Box, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Ball from "./Ball";
import Player from "./Player";

export default function GameBoard() {
  const [playerLeftPos, setPlayerLeftPos] = useState<number>(185);
  const [playerRightPos, setPlayerRightPos] = useState<number>(185);
  const [ballPos, setBallPos] = useState<{ x: number; y: number }>({
    x: 285,
    y: 210,
  });

  const boardRef = useRef<HTMLDivElement>(null);

  const resetBoard = () => {
    setPlayerLeftPos(185);
    setPlayerRightPos(185);
    setBallPos({ x: 0, y: 0 });
  };

  const playerMoveHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (boardRef && boardRef.current && playerLeftPos - 5 >= 100) {
        console.log(playerLeftPos);
        setPlayerLeftPos(playerLeftPos - 5);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (boardRef && boardRef.current && playerLeftPos + 5 <= 270) {
        console.log(playerLeftPos);
        setPlayerLeftPos(playerLeftPos + 5);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", playerMoveHandler);
    return () => {
      document.removeEventListener("keydown", playerMoveHandler);
    };
  }, [playerLeftPos]);

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
        <Box sx={{ backgroundColor: "blue", height: "50%", width: "100%"}} />
        <Player
          lr={true}
          yPos={playerLeftPos}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Player
          lr={false}
          yPos={playerRightPos}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Ball
          ballPos={ballPos}
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
