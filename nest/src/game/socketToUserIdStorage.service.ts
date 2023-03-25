export class GameSocketToUserIdStorage {
  GameSocketToUserId = new Map<string, string>();
  userIdToGameSocket = new Map<string, string>();

  get(socketId: string) {
    return this.GameSocketToUserId.get(socketId);
  }

  getFromUserId(userId: string) {
    return this.userIdToGameSocket.get(userId);
  }

  set(socketId: string, userId: string) {
    this.GameSocketToUserId.set(socketId, userId);
    this.userIdToGameSocket.set(userId, socketId);
  }

  delete(socketId: string) {
    const userId = this.GameSocketToUserId.get(socketId);
    this.GameSocketToUserId.delete(socketId);
    if (userId) this.userIdToGameSocket.delete(userId);
  }
}

export const gameSocketToUserId = new GameSocketToUserIdStorage();
