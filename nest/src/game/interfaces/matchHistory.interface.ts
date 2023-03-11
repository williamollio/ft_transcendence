export interface MatchHistory {
    id: string;
    imageCurrentUser: string | null;
    currentUserId: string;
    imageOpponent: string | null;
    opponentId: string;
    score: string;
    matchWon: boolean;
  }
