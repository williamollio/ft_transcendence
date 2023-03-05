export class SocketToChannelIdStorage {
  socketToChannelId = new Map<string, string>();
  channelIdToSocket = new Map<string, string>();

  get(socketId: string) {
    return this.socketToChannelId.get(socketId);
  }

  getFromUserId(channelId: string) {
    return this.channelIdToSocket.get(channelId);
  }

  set(socketId: string, channelId: string) {
    this.socketToChannelId.set(socketId, channelId);
    this.channelIdToSocket.set(channelId, socketId);
  }

  delete(socketId: string) {
    const channelId = this.socketToChannelId.get(socketId);
    this.socketToChannelId.delete(socketId);
    if (channelId) this.channelIdToSocket.delete(channelId);
  }
}

export const socketToChannelId = new SocketToChannelIdStorage();
