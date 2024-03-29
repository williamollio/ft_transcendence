export const translationKeys = {
  chat: "chat",
  buttons: {
    join: "buttons.join",
    cancel: "buttons.cancel",
    add: "buttons.add",
    promote: "buttons.promote",
    viewProfile: "buttons.viewProfile",
    inviteToGame: "buttons.inviteToGame",
    mute: "buttons.mute",
    ban: "buttons.ban",
    block: "buttons.block",
    unblock: "buttons.unblock",
    create: "buttons.create",
    gameMode: "buttons.gameMode",
    whisper: "buttons.whisper",
  },
  errorMessages: {
    backendErrorMessage: (key: string) => `errorMessages.${key}`,
  },
  chatInfo: {
    userLeft: "chatInfo.userLeft",
    userJoined: "chatInfo.userJoined",
    muted: "chatInfo.muted",
    passwordReq: "chatInfo.passwordReq",
    you: "chatInfo.you",
    missing: "chatInfo.missing",
    notice: "chatInfo.notice",
  },
  createInfo: {
    public: "createInfo.public",
    private: "createInfo.private",
    protected: "createInfo.protected",
    createChannelTitle: "createInfo.createChannelTitle",
    createChannelText: "createInfo.createChannelText",
    name: "createInfo.name",
    access: "createInfo.access",
    password: "createInfo.password",
    joinChannelTitle: "createInfo.joinChannelTitle",
    joinChannelText: "createInfo.joinChannelText",
  },
  roomContext: {
    channelInfo: "roomContext.channelInfo",
    remove: "roomContext.remove",
    invite: "roomContext.invite",
    status: "roomContext.status",
    changePassword: "roomContext.changePassword",
    changeName: "roomContext.changeName",
    newName: "roomContext.newName",
    leavePasswordEmpty: "roomContext.leavePasswordEmpty",
    newNameOfChannel: "roomContext.newNameOfChannel",
    oldPassword: "roomContext.oldPassword",
  },
  invite: {
    classic: "invite.classic",
    mayhem: "invite.mayhem",
    inviteTo: "invite.inviteTo",
    roomInvite: "invite.roomInvite",
    userName: "invite.userName",
    gameInvite: "invite.gameInvite",
    inviteToGame: "invite.inviteToGame",
	failed: "invite.failed",
	notFound: "invite.notFound",
  },
};
