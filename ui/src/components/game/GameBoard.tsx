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
import { BigSocket } from "../../classes/BigSocket.class";
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
import PauseNotification, { PauseState } from "./PauseNotification";
import MainMenu from "./MainMenu";

interface Props {
  gameLoop: GameLoop;
  bigSocket: BigSocket;
  setScoreInfo: React.Dispatch<SetStateAction<scoreInfo>>;
  gameConstants: GameConstants;
}

export default function GameBoard(props: Props) {
  const { gameLoop, bigSocket, setScoreInfo, gameConstants } = props;
  const { t } = useTranslation();
  const toast = useContext(TranscendanceContext);

  const [zoom, toggleZoom] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameState>(GameState.WIN);
  const [gamePositions, setGamePositions] = useState<positionalData>(
    new positionalData(gameConstants)
  );
  const [pause, togglePause] = useState<boolean>(true);
  const [pauseContent, setPauseContent] = useState<PauseState | false>(
    PauseState.main
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
    gameLoop.startLoop(togglePause);
  };

  const gameFinishListener = (data: any) => {
    bigSocket.latestGame = null;
    const thisPlayer =
      gameLoop.activePlayer === 0
        ? bigSocket.spectatingPlayerId
        : gameLoop.activePlayer === 1
        ? gameLoop.scoreInfo.p1Id
        : gameLoop.scoreInfo.p2Id;
    if (thisPlayer === data) setGameStatus(GameState.WIN);
    else setGameStatus(GameState.LOSS);
    toggleZoom(true);

    setTimeout(resetGame, 4000);
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
    setPauseContent(PauseState.main);
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
    if (data.playerNumber === 0) bigSocket.latestGame = "WATCH";
    else bigSocket.latestGame = "PLAY";
    gameLoop.activePlayer = data.playerNumber;
  };

  const getPlayerNames = async (p1Id: string, p2Id: string) => {
    gameLoop.scoreInfo.p1Id = p1Id;
    gameLoop.scoreInfo.p2Id = p2Id;
    ChannelService.getUserName(p1Id).then((resolve) => {
      if (resolve.data) gameLoop.scoreInfo.p1name = resolve.data.name;
      else gameLoop.scoreInfo.p1name = "missing";
    });
    ChannelService.getUserName(p2Id).then((resolve) => {
      if (resolve.data) gameLoop.scoreInfo.p2name = resolve.data.name;
      else gameLoop.scoreInfo.p2name = "missing";
    });
  };

  const mutateGameStatusListener = (data: any) => {
    setScoreInfo({ ...gameLoop.scoreInfo });
    if (gameLoop.scoreInfo.p1name === "" || gameLoop.scoreInfo.p2name === "")
      getPlayerNames(data.player1id, data.player2id);
    if (data.status === "PLAYING") gameLoop.startLoop(togglePause);
    if (data.status === "PAUSED") {
      setPauseContent(PauseState.paused);
      gameLoop.stopLoop(togglePause);
    }
    if (data.status === "DONE" || data.status === "OVER") {
      setPauseContent(false);
    }
  };

  const tryRejoinListener = (data: any) => {
    if (data) {
      bigSocket.joinGame(data.mode);
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
    bigSocket.latestGame = null;
  };

  const leftGameListener = () => {
    setPauseContent(PauseState.main);
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
      if (bigSocket.socket.connected) {
        failedEvents.forEach((event) =>
          bigSocket.socket.on(event, failedListener)
        );
        bigSocket.socket.on("leftGame", leftGameListener);
        bigSocket.socket.on("tryRejoin", tryRejoinListener);
        bigSocket.socket.on("matchFinished", gameFinishListener);
        bigSocket.socket.on("gameStarting", gameStartingListener);
        bigSocket.socket.on("gameJoined", gameJoinedListener);
        bigSocket.socket.on("gameStatus", mutateGameStatusListener);
        bigSocket.socket.on("GI", giListener);
        bigSocket.socket.on("leftWatch", leftWatchListener);
        bigSocket.rejoin();
        return true;
      }
      return false;
    });
    return () => {
      document.removeEventListener("keydown", playerMoveHandler);
      document.removeEventListener("keyup", playerStopHandler);
      listenerWrapper(() => {
        if (bigSocket.socket.connected) {
          failedEvents.forEach((event) =>
            bigSocket.socket.off(event, failedListener)
          );
          bigSocket.socket.off("leftGame", leftGameListener);
          bigSocket.socket.off("tryRejoin", tryRejoinListener);
          bigSocket.socket.off("matchFinished", gameFinishListener);
          bigSocket.socket.off("gameStarting", gameStartingListener);
          bigSocket.socket.off("gameJoined", gameJoinedListener);
          bigSocket.socket.off("gameStatus", mutateGameStatusListener);
          bigSocket.socket.off("GI", giListener);
          bigSocket.socket.off("leftWatch", leftWatchListener);
          return true;
        }
        return false;
      });
      if (gameLoop.interval) gameLoop.stopLoop(togglePause);
    };
  }, [bigSocket]);

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
          <>
            {pauseContent !== false ? (
              <MainMenu
                bigSocket={bigSocket}
                gameLoop={gameLoop}
                pauseContent={pauseContent}
                setPauseContent={setPauseContent}
              />
            ) : (
              false
            )}
          </>
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
