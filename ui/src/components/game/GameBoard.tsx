import { Divider, Paper } from "@mui/material";
import React, {
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { GameLoop } from "../../classes/GameLoop.class";
import { GameSocket } from "../../classes/GameSocket.class";
import { ToastType } from "../../context/toast";
import { TranscendanceContext } from "../../context/transcendance-context";
import { TranscendanceStateActionType } from "../../context/transcendance-reducer";
import {
  GameState,
  failedEvents,
  scoreInfo,
} from "../../interfaces/game.interface";
import { listenerWrapper } from "../../services/initSocket.service";
import { translationKeys } from "../../views/Game/constants";
import Ball from "./Ball";
import Player from "./Player";
import ChannelService from "../../services/channel.service";
import GameEndDisplay from "./GameEndDisplay";
import { positionalData } from "../../classes/positionalData.class";

interface Props {
  gameLoop: GameLoop;
  gameSocket: GameSocket;
  setScoreInfo: React.Dispatch<SetStateAction<scoreInfo>>;
}

export default function GameBoard(props: Props) {
  const { gameLoop, gameSocket, setScoreInfo } = props;
  const { t } = useTranslation();
  const toast = useContext(TranscendanceContext);

  const boardRef = useRef<HTMLDivElement>(null);

  const [zoom, toggleZoom] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameState>(GameState.WIN);
  const [gamePositions, setGamePositions] = useState<positionalData>(
    new positionalData()
  );

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

  const gameStartingListener = () => {
    setScoreInfo({ ...gameLoop.scoreInfo });
    gameLoop.startLoop();
  };

  const gameFinishListener = (data: any) => {
    const thisPlayer =
      gameLoop.activePlayer === 1
        ? gameLoop.scoreInfo.p1Id
        : gameLoop.scoreInfo.p2Id;
    if (thisPlayer === data) setGameStatus(GameState.WIN);
    else setGameStatus(GameState.LOSS);
    toggleZoom(true);

    gameLoop.resetPositions();
    setGamePositions(gameLoop.positionalData);
    gameLoop.scoreInfo = {
      p1Id: "",
      p2Id: "",
      p1name: "",
      p2name: "",
      p1s: 0,
      p2s: 0,
    };
    setScoreInfo(gameLoop.scoreInfo);
  };

  const giListener = (data: any) => {
    gameLoop.scoreInfo.p1s = data.p1s;
    gameLoop.scoreInfo.p2s = data.p2s;
    setGamePositions({
      ...gamePositions,
      ballOffset: { x: data.bx - 15, y: data.by - 15 },
      playerRightYOffset:
        gameLoop.activePlayer !== 2
          ? data.p2y - 50
          : gameLoop.positionalData.playerRightYOffset,
      playerLeftYOffset:
        gameLoop.activePlayer !== 1
          ? data.p1y - 50
          : gameLoop.positionalData.playerLeftYOffset,
    });
    setScoreInfo({ ...gameLoop.scoreInfo });
  };

  const gameJoinedListener = (data: any) => {
    gameLoop.activePlayer = data.playerNumber;
  };

  const getPlayerNames = async (p1Id: string, p2Id: string) => {
    gameLoop.scoreInfo.p1Id = p1Id;
    gameLoop.scoreInfo.p2Id = p2Id;
    ChannelService.getUserName(p1Id)
      .then((resolve) => (gameLoop.scoreInfo.p1name = resolve.data.name))
      .catch(() => {
        console.log("failed to get player 1 name");
      });
    ChannelService.getUserName(p2Id)
      .then((resolve) => (gameLoop.scoreInfo.p2name = resolve.data.name))
      .catch(() => {
        console.log("failed to get player 2 name");
      });
  };

  const mutateGameStatusListener = (data: any) => {
    setScoreInfo({ ...gameLoop.scoreInfo });
    if (gameLoop.scoreInfo.p1name === "" || gameLoop.scoreInfo.p2name === "")
      getPlayerNames(data.player1id, data.player2id);
    if (data.status === "PLAYING") gameLoop.startLoop();
  };

  const tryRejoinListener = (data: any) => {
    console.log("rejoined");
    if (data) {
      gameSocket.joinGame(data);
    }
  };

  const failedListener = (data: any) => {
    gameLoop.resetPositions();
    toast.dispatchTranscendanceState({
      type: TranscendanceStateActionType.TOGGLE_TOAST,
      toast: {
        type: ToastType.ERROR,
        title: t(translationKeys.invite.failed) as string,
        message: `${data}`,
      },
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", playerMoveHandler);
    document.addEventListener("keyup", playerStopHandler);
    listenerWrapper(() => {
      if (gameSocket.socket.connected) {
        failedEvents.forEach((event) =>
          gameSocket.socket.on(event, failedListener)
        );
        gameSocket.socket.on("tryRejoin", tryRejoinListener);
        gameSocket.socket.on("matchFinished", gameFinishListener);
        gameSocket.socket.on("gameStarting", gameStartingListener);
        gameSocket.socket.on("gameJoined", gameJoinedListener);
        gameSocket.socket.on("gameStatus", mutateGameStatusListener);
        gameSocket.socket.on("GI", giListener);
        gameSocket.rejoin();
        return true;
      }
      return false;
    });
    return () => {
      document.removeEventListener("keydown", playerMoveHandler);
      document.removeEventListener("keyup", playerStopHandler);
      listenerWrapper(() => {
        if (gameSocket.socket.connected) {
          failedEvents.forEach((event) =>
            gameSocket.socket.off(event, failedListener)
          );
          gameSocket.socket.off("tryRejoin", tryRejoinListener);
          gameSocket.socket.off("matchFinished", gameFinishListener);
          gameSocket.socket.off("gameStarting", gameStartingListener);
          gameSocket.socket.off("gameJoined", gameJoinedListener);
          gameSocket.socket.off("gameStatus", mutateGameStatusListener);
          gameSocket.socket.off("GI", giListener);
          return true;
        }
        return false;
      });
      if (gameLoop.interval) gameLoop.stopLoop();
    };
  }, [gameSocket]);

  return (
    <>
      <Paper
        ref={boardRef}
        sx={{
          width: 672,
          height: 450,
          backgroundColor: "white",
          display: "flex",
        }}
      >
        <Divider
          orientation="vertical"
          sx={{
            position: "relative",
            left: 335,
            height: "100%",
            bgcolor: "black",
          }}
        />
        <Player
          lr={true}
          yPos={gamePositions.playerLeftYOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Player
          lr={false}
          yPos={gamePositions.playerRightYOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Player>
        <Ball
          ballPos={gamePositions.ballOffset}
          posRef={
            boardRef.current
              ? boardRef.current
              : { offsetLeft: 0, offsetTop: 0 }
          }
        ></Ball>
        <GameEndDisplay
          zoom={zoom}
          toggleZoom={toggleZoom}
          gameState={gameStatus}
        />
      </Paper>
    </>
  );
}
