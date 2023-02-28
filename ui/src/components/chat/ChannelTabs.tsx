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
import { user } from "../../interfaces/chat.interfaces";

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
        channelSocket.channels[index] = {
          ...channelSocket.channels[index],
          key: data.name,
        };
      } else {
        if (data.type === "DIRECTMESSAGE") {
          let index = data.users.findIndex(
            (element: { userId: string }) =>
              element.userId !== channelSocket.user.id
          );
          if (index >= 0) {
            setNewChannel(
              channelSocket.channels[
                channelSocket.channels.push(
                  new chatRoom(data.id, data.users[index].user.name, data.type)
                ) - 1
              ]
            );
          }
        } else {
          setNewChannel(
            channelSocket.channels[
              channelSocket.channels.push(
                new chatRoom(data.id, data.name, data.type)
              ) - 1
            ]
          );
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

  useEffect(() => {
    channelSocket.socket.on(
      "roomLeft",
      (data: { userId: string; channelId: string }) => {
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
        }
      }
    );
    channelSocket.socket.on("roomCreated", roomCreatedListener);
    channelSocket.socket.on("roomJoined", roomJoinedListener);
    channelSocket.socket.on("roomEdited", roomEditedListener);
    return () => {
      channelSocket.socket.off("roomLeft");
      channelSocket.socket.off("roomCreated");
      channelSocket.socket.off("roomJoined");
      channelSocket.socket.off("roomEdited");
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
      value={typeof currentRoom !== "boolean" ? currentRoom.key : false}
      onChange={handleRoomChange}
      variant="scrollable"
    >
      {channelSocket.channels.map((channel: chatRoom) => {
        return (
          <Tab
            sx={{
              color: "white",
              minWidth: "30px",
              width: "auto",
              maxWidth: "100px",
            }}
            value={channel.key}
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
