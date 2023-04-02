export interface leaderBoardEntry {
  id: string;
  name: string;
  rank: number;
  rating: number;
  wins: number;
  loss: number;
  image: string;
}

export interface match {
  player1: {
    id: string;
    score: number;
    image: string | null;
  };
  player2: {
    id: string;
    score: number;
    image: string | null;
  };
  winner: boolean;
}

export interface MatchHistoryDto {
  id: string;
  imageCurrentUser: string | null;
  currentUserId: string;
  imageOpponent: string | null;
  opponentId: string;
  p1Score: number;
  p2Score: number;
  matchWon: boolean;
}

export interface playerStats {
  currentRating: number;
  rank: number;
  gamesWon: number;
  gamesLost: number;
}
