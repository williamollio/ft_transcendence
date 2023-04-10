import { useState } from "react";
import { GameLoop } from "../../classes/GameLoop.class";
import GameBoard from "./GameBoard";
import ScoreDisplay from "./ScoreDisplay";
import { GameSocket } from "../../classes/GameSocket.class";
import { GameConstants, scoreInfo } from "../../interfaces/game.interface";
import { UserSocket } from "../../classes/UserSocket.class";

interface Props {
  gameSocket: GameSocket;
  userSocket: UserSocket;
}

export default function Game(props: Props) {
  const { gameSocket, userSocket } = props;

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
    new GameLoop(gameSocket, userSocket, gameConstants)
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
        gameSocket={gameSocket}
        setScoreInfo={setScoreInfo}
        gameConstants={gameConstants}
      />
      <ScoreDisplay scoreInfo={scoreInfo} />
    </>
  );
}
