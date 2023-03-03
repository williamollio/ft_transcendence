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
import { fetchChannelData } from "./hooks/channelData.fetch";
import { useQuery } from "@tanstack/react-query";
import { fetchJoinedChannels } from "./hooks/joinedChannels.fetch";
import {
  channelUser,
  DBChannelElement,
  messagesDto,
} from "../../interfaces/chat.interfaces";

export function ChannelTabs({
  currentRoom,
  setContextMenu,
  contextMenu,
  toggleAlert,
  toggleOpen,
  channelSocket,
  setNewChannel,
}: {
  currentRoom: chatRoom | boolean;
  setContextMenu: Dispatch<
    SetStateAction<{
      mouseX: number;
      mouseY: number;
      channel: chatRoom;
    } | null>
  >;
  contextMenu: {
    mouseX: number;
    mouseY: number;
    channel: chatRoom;
  } | null;
  toggleAlert: Dispatch<SetStateAction<boolean>>;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
  channelSocket: ChannelSocket;
  setNewChannel: (newChannel: chatRoom | boolean) => void;
}) {
  const [channelQueryId, setChannelQueryId] = useState<string | undefined>(
    undefined
  );
  const [channelList, setChannelList] = useState<chatRoom[]>(
    channelSocket.channels
  );

  const updateChannelList = () => {
    const newList: Array<chatRoom> = [];
    channelSocket.channels.forEach((element) => {
      newList.push(element);
    });
    setChannelList(newList);
  };

  const {
    data: joinedChannels,
    isLoading: joinedChannesLoading,
    isError: joinedChannesError,
  } = useQuery(["joinedChannels"], fetchJoinedChannels, {
    enabled: channelSocket.user.id !== "",
  });

  useEffect(() => {
    if (joinedChannels && !joinedChannesLoading && !joinedChannesError) {
      joinedChannels.forEach((element: DBChannelElement) => {
        channelSocket.channels.push({
          key: element.name,
          id: element.id,
          access: element.type,
          users: new Array<channelUser>(),
          messages: new Array<messagesDto>(),
        });
      });
      updateChannelList();
      channelSocket.channels.forEach((element) => {
        channelSocket.connectToRoom(element.id!);
      });
    }
  }, [joinedChannels]);

  const { data, isLoading, isError, refetch } = useQuery(
    ["channels", channelQueryId],
    () => fetchChannelData(channelQueryId),
    { enabled: typeof channelQueryId !== "undefined" }
  );

  useEffect(() => {
    if (
      typeof channelQueryId !== "undefined" &&
      data &&
      !isLoading &&
      !isError
    ) {
      let index = channelSocket.channels.findIndex(
        (element) => element.id === data.id
      );
      if (index != -1) {
        const newList: Array<chatRoom> = [];
        channelSocket.channels.forEach((element) => {
          if (element.id === data.id) {
            newList.push({ ...element, key: data.name, access: data.type});
          } else newList.push(element);
        });
        setChannelList(newList);
      } else {
        if (data.type === "DIRECTMESSAGE") {
          let index = data.users.findIndex(
            (element: { userId: string }) =>
              element.userId !== channelSocket.user.id
          );
          if (index >= 0) {
            const newList: Array<chatRoom> = [];
            let userIndex = data.users.findIndex(
              (element: { id: string }) => element.id !== channelSocket.user.id
            );
            let channelIndex = channelSocket.channels.push(
              new chatRoom(data.id, data.users[userIndex].user.name, data.type)
            );
            channelSocket.channels.forEach((element) => {
              newList.push(element);
            });
            setChannelList(newList);
            setNewChannel(channelSocket.channels[channelIndex - 1]);
          }
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
    }
  }, [data]);

  const roomCreatedListener = (channelId: string, creatorId: string) => {
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
    if (data.userId === channelSocket.user.id) {
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
    channelSocket.registerListener("roomLeft", roomLeftListener);
    channelSocket.registerListener("roomCreated", roomCreatedListener);
    channelSocket.registerListener("roomJoined", roomJoinedListener);
    channelSocket.registerListener("roomEdited", roomEditedListener);
    return () => {
      channelSocket.removeListener("roomLeft", roomLeftListener);
      channelSocket.removeListener("roomCreated", roomCreatedListener);
      channelSocket.removeListener("roomJoined", roomJoinedListener);
      channelSocket.removeListener("roomEdited", roomEditedListener);
    };
  }, [channelSocket.socket]);

  const handleRoomChange = (event: SyntheticEvent, newValue: chatRoom) => {
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
    toggleAlert(false);
    setNewChannel(currentRoom);
    toggleOpen(true);
  };

  return (
    <Tabs
      sx={{ width: "300px" }}
      value={typeof currentRoom !== "boolean" ? currentRoom.id : false}
      onChange={handleRoomChange}
      variant="scrollable"
    >
      {channelList.map((channel: chatRoom) => {
        return (
          <Tab
            sx={{
              color: "white",
              minWidth: "30px",
              width: "auto",
              maxWidth: "100px",
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
        sx={{ width: "30px", minWidth: "30px" }}
        icon={<AddIcon />}
        onClick={newRoom}
      ></Tab>
    </Tabs>
  );
}
