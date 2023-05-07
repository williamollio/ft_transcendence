import React, { useState } from "react";
import { GameLoop } from "../../classes/GameLoop.class";
import GameBoard from "./GameBoard";
import ScoreDisplay from "./ScoreDisplay";
import { BigSocket } from "../../classes/BigSocket.class";
import { GameConstants, scoreInfo } from "../../interfaces/game.interface";

interface Props {
  bigSocket: BigSocket;
}

export default function Game(props: Props) {
  const { bigSocket } = props;

  const gameConstants: GameConstants = {
    boardHeight: 450,
    boardWidth: 672,
    paddleRelativeOffset: 30,
    paddleSize: 100,
    paddleWidth: 20,
    ballSize: 30,
    playerSpeed: 7,
  };

  const [gameLoop] = useState<GameLoop>(
    new GameLoop(bigSocket, gameConstants)
  );
  const [scoreInfo, setScoreInfo] = useState<scoreInfo>({
    p1s: 0,
    p2s: 0,
    p1name: "",
    p2name: "",
    p1Id: "",
    p2Id: "",
  });

  return (
    <>
      <GameBoard
        gameLoop={gameLoop}
        bigSocket={bigSocket}
        setScoreInfo={setScoreInfo}
        gameConstants={gameConstants}
      />
      <ScoreDisplay scoreInfo={scoreInfo} />
    </>
  );
}
