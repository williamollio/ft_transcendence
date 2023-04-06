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
  GameConstants,
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
import PauseOverlay from "./PauseOverlay";
import PauseNotification from "./PauseNotification";

interface Props {
  gameLoop: GameLoop;
  gameSocket: GameSocket;
  setScoreInfo: React.Dispatch<SetStateAction<scoreInfo>>;
  gameConstants: GameConstants;
}

export default function GameBoard(props: Props) {
  const { gameLoop, gameSocket, setScoreInfo, gameConstants } = props;
  const { t } = useTranslation();
  const toast = useContext(TranscendanceContext);

  const [zoom, toggleZoom] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameState>(GameState.WIN);
  const [gamePositions, setGamePositions] = useState<positionalData>(
    new positionalData(gameConstants)
  );
  const [pause, togglePause] = useState<boolean>(true);
  const [pauseContent, setPauseContent] = useState<JSX.Element | boolean>(
    false
  ); // set main menu as initial value

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
    gameLoop.startLoop(togglePause);
  };

  const gameFinishListener = (data: any) => {
    gameSocket.latestGame = null;
    const thisPlayer =
      gameLoop.activePlayer === 0
        ? gameSocket.spectatingPlayerId
        : gameLoop.activePlayer === 1
        ? gameLoop.scoreInfo.p1Id
        : gameLoop.scoreInfo.p2Id;
    if (thisPlayer === data) setGameStatus(GameState.WIN);
    else setGameStatus(GameState.LOSS);
    toggleZoom(true);

    resetGame();
  };

  const resetGame = () => {
    gameLoop.resetPositions(togglePause);
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
    setPauseContent(false); // back to main menu
  };

  const giListener = (data: any) => {
    if (gameLoop.scoreInfo.p1s !== data.p1s) gameLoop.scoreInfo.p1s = data.p1s;
    if (gameLoop.scoreInfo.p2s !== data.p2s) gameLoop.scoreInfo.p2s = data.p2s;
    setGamePositions(
      new positionalData(gameConstants, {
        ...gamePositions,
        ballOffset: {
          x: data.bx - gameConstants.ballSize / 2,
          y: data.by - gameConstants.ballSize / 2,
        },
        playerRightYOffset:
          gameLoop.activePlayer !== 2
            ? data.p2y - gameConstants.paddleSize / 2
            : gameLoop.positionalData.playerRightYOffset,
        playerLeftYOffset:
          gameLoop.activePlayer !== 1
            ? data.p1y - gameConstants.paddleSize / 2
            : gameLoop.positionalData.playerLeftYOffset,
      })
    );
    setScoreInfo({ ...gameLoop.scoreInfo });
  };

  const gameJoinedListener = (data: any) => {
    if (data.playerNumber === 0) gameSocket.latestGame = "WATCH";
    else gameSocket.latestGame = "PLAY";
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
    if (data.status === "PLAYING") gameLoop.startLoop(togglePause);
    if (data.status === "PAUSED") {
      setPauseContent(<PauseNotification />);
      gameLoop.stopLoop(togglePause);
    }
    if (data.status === "DONE" || data.status === "OVER") {
      setPauseContent(false);
    }
  };

  const tryRejoinListener = (data: any) => {
    if (data) {
      gameSocket.joinGame(data.mode);
      gameLoop.positionalData = new positionalData(gameConstants, {
        ...gamePositions,
        playerLeftYOffset: data.pos.p1y - gameConstants.paddleSize / 2,
        playerRightYOffset: data.pos.p2y - gameConstants.paddleSize / 2,
        ballOffset: {
          x: data.pos.ballPos.x - gameConstants.ballSize / 2,
          y: data.pos.ballPos.y - gameConstants.ballSize / 2,
        },
      });
    }
  };

  const leftWatchListener = () => {
    resetGame();
    gameSocket.latestGame = null;
  };

  const failedListener = (data: any) => {
    gameLoop.resetPositions(togglePause);
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
        gameSocket.socket.on("leftWatch", leftWatchListener);
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
          gameSocket.socket.off("leftWatch", leftWatchListener);
          return true;
        }
        return false;
      });
      if (gameLoop.interval) gameLoop.stopLoop(togglePause);
    };
  }, [gameSocket]);

  return (
    <>
      <Paper
        sx={{
          position: "relative",
          width: gameConstants.boardWidth,
          height: gameConstants.boardHeight,
          backgroundColor: "white",
          display: "flex",
        }}
      >
        <PauseOverlay open={pause}>
          <>{pauseContent}</>
        </PauseOverlay>
        <Divider
          orientation="vertical"
          sx={{
            position: "relative",
            left: gameConstants.boardWidth / 2 - 1,
            height: "100%",
            bgcolor: "black",
          }}
        />
        <Player
          lr={true}
          yPos={gamePositions.playerLeftYOffset}
          gameConstants={gameConstants}
        ></Player>
        <Player
          lr={false}
          yPos={gamePositions.playerRightYOffset}
          gameConstants={gameConstants}
        ></Player>
        <Ball
          ballPos={gamePositions.ballOffset}
          gameConstants={gameConstants}
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
