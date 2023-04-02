import { Tabs, Tab, Grid } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { chatRoom } from "../../classes/chatRoom.class";
import AddIcon from "@mui/icons-material/Add";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { useQuery } from "@tanstack/react-query";
import {
  channelUser,
  ContextMenu,
  DBChannelElement,
  messagesDto,
} from "../../interfaces/chat.interface";
import ChannelService from "../../services/channel.service";
import { translationKeys } from "./constants";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { listenerWrapper } from "../../services/initSocket.service";
import { Message } from "@mui/icons-material";

interface Props {
  currentRoom: chatRoom | boolean;
  setContextMenu: Dispatch<SetStateAction<ContextMenu | null>>;
  contextMenu: ContextMenu | null;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
  channelSocket: ChannelSocket;
  setNewChannel: (newChannel: chatRoom | boolean) => void;
  blockedUsers: Array<any>;
}

export function ChannelTabs(props: Props) {
  const {
    currentRoom,
    setContextMenu,
    contextMenu,
    toggleOpen,
    channelSocket,
    setNewChannel,
    blockedUsers,
  } = props;
  const { t } = useTranslation();

  const [channelQueryId, setChannelQueryId] = useState<string | undefined>(
    undefined
  );
  const theme = useTheme();

  const [channelList, setChannelList] = useState<chatRoom[]>(
    channelSocket.channels
  );

  const removeBlockedMessages = (messages: messagesDto[]) => {
    let newList = new Array<messagesDto>();
    messages.forEach((message) => {
      if (!blockedUsers.some((user) => message.userId === user))
        newList.push(message);
    });
    return newList;
  };

  const updateChannelList = () => {
    const newList: Array<chatRoom> = [];
    channelSocket.channels.forEach((element) => {
      newList.push(element);
    });
    setChannelList(newList);
  };

  const {
    data: joinedChannels,
    isLoading: joinedChannelsLoading,
    isError: joinedChannelsError,
    isFetching,
  } = useQuery(["joinedChannels"], ChannelService.fetchJoinedChannels, {
    enabled: channelSocket.user.id !== "",
  });

  useEffect(() => {
    if (channelSocket.channels.length === 0) {
      if (
        joinedChannels &&
        blockedUsers &&
        !joinedChannelsLoading &&
        !joinedChannelsError &&
        !isFetching
      ) {
        const newList = new Array<chatRoom>();
        if (joinedChannels.length === 0) {
          channelSocket.channels = newList;
          updateChannelList();
        }
        joinedChannels.forEach((element: DBChannelElement) => {
          element.messages = removeBlockedMessages(element.messages);
          if (element.type !== "DIRECTMESSAGE") {
            newList.push({
              key: element.name,
              id: element.id,
              access: element.type,
              users: new Array<channelUser>(),
              messages: element.messages,
            });
            channelSocket.channels = newList;
            updateChannelList();
            channelSocket.connectToRoom(element.id!);
          } else {
            ChannelService.getUsersChannel(element.id).then((resolve) => {
              let dmName = resolve.data.find(
                (user) => user.id !== channelSocket.user.id
              )?.name;
              if (dmName) {
                newList.push({
                  key: dmName,
                  id: element.id,
                  access: element.type,
                  users: new Array<channelUser>(),
                  messages: element.messages,
                });
              }
              channelSocket.channels = newList;
              updateChannelList();
              channelSocket.connectToRoom(element.id!);
            });
          }
        });
      }
    }
  }, [
    joinedChannels,
    blockedUsers,
    joinedChannelsLoading,
    joinedChannelsError,
    isFetching,
  ]);

  const { data, isLoading, isError, isRefetching, refetch } = useQuery(
    ["channels", channelQueryId],
    () => ChannelService.fetchChannelData(channelQueryId),
    { enabled: typeof channelQueryId !== "undefined" }
  );

  useEffect(() => {
    if (data && data !== "" && !isLoading && !isError && !isRefetching) {
      let index = channelSocket.channels.findIndex(
        (element) => element.id === data.id
      );
      if (index != -1) {
        const newList: Array<chatRoom> = [];
        channelSocket.channels[index] = {
          ...channelSocket.channels[index],
          key: data.name,
          access: data.type,
        };
        channelSocket.channels.forEach((element) => {
          newList.push(element);
        });
        setChannelList(newList);
      } else {
        if (data.type === "DIRECTMESSAGE") {
          const newList: Array<chatRoom> = [];
          ChannelService.getUsersChannel(data.id).then((resolve) => {
            let userName = resolve.data.find(
              (element) => element.id !== channelSocket.user.id
            )?.name;
            let channelIndex = channelSocket.channels.push(
              new chatRoom(
                data.id,
                userName
                  ? userName
                  : (t(translationKeys.chatInfo.missing) as string),
                data.type
              )
            );
            channelSocket.channels.forEach((element) => {
              newList.push(element);
            });
            setChannelList(newList);
            setNewChannel(channelSocket.channels[channelIndex - 1]);
          });
        } else {
          const newList: Array<chatRoom> = [];
          let channelIndex = channelSocket.channels.push(
            new chatRoom(data.id, data.name, data.type)
          );
          channelSocket.channels.forEach((element) => {
            newList.push(element);
          });
          setChannelList(newList);
          setNewChannel(channelSocket.channels[channelIndex - 1]);
        }
      }
      setChannelQueryId(undefined);
    }
  }, [data, isLoading, isError, isRefetching]);

  const roomCreatedListener = (channelId: string, _creatorId: string) => {
    setChannelQueryId(channelId);
  };

  const roomJoinedListener = (data: { userId: string; channelId: string }) => {
    if (data.userId === channelSocket.user.id) {
      setChannelQueryId(data.channelId);
    }
  };

  const roomEditedListener = (channelId: string) => {
    setChannelQueryId(channelId);
    refetch();
  };

  const roomLeftListener = (data: { userId: string; channelId: string }) => {
    if (
      data.userId === channelSocket.user.id ||
      channelSocket.channels.find((element) => element.id === data.channelId)
        ?.access === "DIRECTMESSAGE"
    ) {
      let index = channelSocket.channels.findIndex(
        (element) => element.id === data.channelId
      );
      if (index != -1) {
        channelSocket.channels.splice(index, 1);
        if (channelSocket.channels.length > 0) {
          if (index == 0) {
            setNewChannel(channelSocket.channels[index]);
          } else {
            setNewChannel(channelSocket.channels[index - 1]);
          }
        } else setNewChannel(false);
        const newList: Array<chatRoom> = [];
        channelSocket.channels.forEach((element) => {
          newList.push(element);
        });
        setChannelList(newList);
      }
    }
  };

  useEffect(() => {
    listenerWrapper(() => {
      if (channelSocket.socket.connected) {
        channelSocket.registerListener("roomLeft", roomLeftListener);
        channelSocket.registerListener("roomCreated", roomCreatedListener);
        channelSocket.registerListener("roomJoined", roomJoinedListener);
        channelSocket.registerListener("roomEdited", roomEditedListener);
        return true;
      }
      return false;
    });
    return () => {
      listenerWrapper(() => {
        if (channelSocket.socket.connected) {
          channelSocket.removeListener("roomLeft", roomLeftListener);
          channelSocket.removeListener("roomCreated", roomCreatedListener);
          channelSocket.removeListener("roomJoined", roomJoinedListener);
          channelSocket.removeListener("roomEdited", roomEditedListener);
          return true;
        }
        return false;
      });
    };
  }, [channelSocket.socket, channelSocket.socket.connected]);

  const handleRoomChange = (_event: SyntheticEvent, newValue: chatRoom) => {
    setNewChannel(newValue);
  };

  const handleContextMenu = (event: any, cRoom: chatRoom) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            channel: cRoom,
          }
        : null
    );
  };

  const newRoom = () => {
    setNewChannel(currentRoom);
    toggleOpen(true);
  };

  return (
    <Tabs
      sx={{
        width: "300px",
      }}
      value={typeof currentRoom !== "boolean" ? currentRoom.id : false}
      onChange={handleRoomChange}
      variant="scrollable"
      TabIndicatorProps={{
        style: { marginBottom: "3px" },
      }}
    >
      {channelList.map((channel: chatRoom) => {
        return (
          <Tab
            sx={{
              color: "white",
              minWidth: "30px",
              maxWidth: "100px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            value={channel.id}
            key={channel.id}
            onContextMenu={(e) => handleContextMenu(e, channel)}
            label={
              <Grid container alignItems="center">
                <Grid item>{channel.key}</Grid>
              </Grid>
            }
            onClick={() => {
              setNewChannel(channel);
            }}
          ></Tab>
        );
      })}
      <Tab
        key={"AddChannel"}
        sx={{
          width: "30px",
          minWidth: "30px",
          color: theme.palette.secondary.main,
        }}
        icon={<AddIcon />}
        onClick={newRoom}
      ></Tab>
    </Tabs>
  );
}
