import { Box, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GameInfo } from "../../classes/GameInfo.class";
import { GameLoop } from "../../classes/GameLoop.class";
import { GameSocket } from "../../classes/GameSocket.class";
import { listenerWrapper } from "../../services/initSocket.service";
import Ball from "./Ball";
import Player from "./Player";
import * as jspb from "protobufjs";

interface Props {
  gameLoop: GameLoop;
  gameSocket: GameSocket;
}

export default function GameBoard(props: Props) {
  const { gameLoop, gameSocket } = props;

  const gameInfo = new GameInfo();

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

  const gameStartingListener = (data: any) => {
    gameLoop.startLoop();
  };

  const gameFinishListener = (data: any) => {
    gameLoop.stopLoop();
  };

  const giListener = (data: any) => {
    gameLoop.positionalData.ballOffset = { x: data.bx, y: data.by };
  };

  const gameJoinedListener = (data: any) => {
    console.log(data);
  };

  const mutateGameStatusListener = (data: any) => {
    console.log(data);
  };

  const inviteRefusedListener = (data: any) => {
    console.log(data);
  };

  const invitedToGameListener = (data: any) => {
    console.log(data);
  };

  const matchFinishedListener = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    document.addEventListener("keydown", playerMoveHandler);
    document.addEventListener("keyup", playerStopHandler);
    listenerWrapper(() => {
      if (gameSocket.socket.connected) {
        gameSocket.socket.on("matchFinished", gameFinishListener);
        gameSocket.socket.on("gameStarting", gameStartingListener);
        gameSocket.socket.on("GI", giListener);
        gameSocket.socket.on("gameJoined", gameJoinedListener);
        gameSocket.socket.on("gameStatus", mutateGameStatusListener);
        gameSocket.socket.on("inviteRefused", inviteRefusedListener);
        gameSocket.socket.on("invitedToGame", invitedToGameListener);
        gameSocket.socket.on("matchFinished", matchFinishedListener);
        return true;
      }
      return false;
    });
    return () => {
      document.removeEventListener("keydown", playerMoveHandler);
      document.removeEventListener("keyup", playerStopHandler);
      listenerWrapper(() => {
        if (gameSocket.socket.connected) {
          gameSocket.socket.off("matchFinished", gameFinishListener);
          gameSocket.socket.off("gameStarting", gameStartingListener);
          gameSocket.socket.off("GI", giListener);
          gameSocket.socket.off("gameJoined", gameJoinedListener);
          gameSocket.socket.off("gameStatus", mutateGameStatusListener);
          gameSocket.socket.off("inviteRefused", inviteRefusedListener);
          gameSocket.socket.off("invitedToGame", invitedToGameListener);
          gameSocket.socket.off("matchFinished", matchFinishedListener);
          return true;
        }
        return false;
      });
    };
  }, [gameLoop, gameSocket]);

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
