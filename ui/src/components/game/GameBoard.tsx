import { Box, Paper } from "@mui/material";
import { t } from "i18next";
import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { GameLoop } from "../../classes/GameLoop.class";
import { GameSocket } from "../../classes/GameSocket.class";
import { ToastType } from "../../context/toast";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import { listenerWrapper } from "../../services/initSocket.service";
import { translationKeys } from "../../views/Game/constants";
import Ball from "./Ball";
import Player from "./Player";

interface Props {
  gameLoop: GameLoop;
  gameSocket: GameSocket;
}

export default function GameBoard(props: Props) {
  const { gameLoop, gameSocket } = props;
  const { t } = useTranslation();
  const toast = useContext(TranscendanceContext);

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
    console.log("starting received");
  };

  const gameFinishListener = (data: any) => {
    gameLoop.stopLoop();
    gameLoop.resetPositions();
  };

  const giListener = (data: any) => {
    gameLoop.positionalData.ballOffset = { x: data.bx - 15, y: data.by - 15 };
    if (gameLoop.activePlayer === 1) {
      gameLoop.positionalData.playerRightYOffset = data.p2y - 50;
    } else if (gameLoop.activePlayer === 2) {
      gameLoop.positionalData.playerLeftYOffset = data.p1y - 50;
    } else {
      console.log(data);
      gameLoop.positionalData.playerRightYOffset = data.p2y - 50;
      gameLoop.positionalData.playerLeftYOffset = data.p1y - 50;
    }
  };

  const gameJoinedListener = (data: any) => {
    gameLoop.activePlayer = data.playerNumber;
    console.log(data);
  };

  const mutateGameStatusListener = (data: any) => {
    console.log(data);
    if (data.status === "PLAYING") gameLoop.startLoop();
  };

  const inviteRefusedListener = (data: any) => {
    console.log(data);
  };

  const invitedToGameListener = (data: any) => {
    toast.dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.SUCCESS,
        title: "Invited to Game",
        message: (data.initiatingUser.name +
          t(translationKeys.inviteTo)) as string,
        onAccept: () =>
          gameSocket.joinGame(data.game.mode, data.initiatingUser.id),
        onRefuse: () => gameSocket.refuseInvite(data.initiatingUser.id),
      },
    });
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
          yPos={gameLoop.positionalData.playerLeftYOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Player
          lr={false}
          yPos={gameLoop.positionalData.playerRightYOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Ball
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
