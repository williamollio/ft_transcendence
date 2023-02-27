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
    if (typeof channelQueryId !== "undefined" && !isLoading && !isError) {
      let index = channelSocket.channels.findIndex((element) => {
        element.id === data.id;
      });
      if (index != -1) {
        channelSocket.channels[index].key = data.name;
      } else {
        setNewChannel(
          channelSocket.channels[
            channelSocket.channels.push(
              new chatRoom(data.id, data.name, data.type)
            ) - 1
          ]
        );
      }
      setChannelQueryId(undefined);
    }
  }, [data]);

  const roomCreatedListener = (channelId: string, creatorId: string) => {
    setChannelQueryId(channelId);
  };

  const roomJoinedListener = (data: { userId: string; channelId: string }) => {
    if (data.userId === channelSocket.user.id) {
      console.log("creating");
      setChannelQueryId(data.channelId);
    }
  };

  const roomEditedListener = (channelId: string) => {
    setChannelQueryId(channelId);
  };

  const roomLeftListener = (data: { userId: string; channelId: string }) => {
    let index = channelSocket.channels.findIndex(
      (element) => element.id === data.channelId
    );
    console.log(index);
    if (index != -1) {
      channelSocket.channels.splice(index, 1);
    }
  };

  useEffect(() => {
    channelSocket.socket.on("roomCreated", roomCreatedListener);
    channelSocket.socket.on("roomLeft", roomLeftListener);
    channelSocket.socket.on("roomJoined", roomJoinedListener);
    channelSocket.socket.on("roomEdited", roomEditedListener);
    return () => {
      channelSocket.socket.off("roomCreated", roomCreatedListener);
      channelSocket.socket.off("roomLeft", roomLeftListener);
      channelSocket.socket.off("Joinedeated", roomJoinedListener);
      channelSocket.socket.off("roomEdited", roomEditedListener);
    };
  }, []);

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
      value={currentRoom}
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
            value={channel}
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
