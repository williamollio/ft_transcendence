import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  ListItemText,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { User } from "../../../interfaces/user.interface";
import React from "react";
import { fetchProfilePicture } from "../../../utils/picture-helper";
import friendshipsService from "../../../services/friendships.service";
import CloseIcon from "@mui/icons-material/Close";
import { StyledAvatarBadge } from "../AvatarBadge/StyledAvatarBadge";

interface Props {
  userId: string;
  open: boolean;
  users: User[];
  triggerDrawerOpen: () => void;
}
export default function ListFriends(props: Props) {
  const { userId, open, users, triggerDrawerOpen } = props;

  function createDmChat() {
    console.log("createDmChat");
  }

  async function deleteFriendship(friendId: string) {
    await friendshipsService.deleteRequest(userId, friendId);
  }

  const [profilePictures, setProfilePictures] = React.useState<{
    [key: string]: string;
  }>({});

  React.useEffect(() => {
    async function loadProfilePictures() {
      const pictures: { [key: string]: string } = {};
      for (const user of users) {
        if (user.filename) {
          const picture = await getProfilePicture(user.id);
          pictures[user.id] = picture;
        } else {
          pictures[user.id] = "";
        }
      }

      setProfilePictures(pictures);
    }

    loadProfilePictures();
  }, [users]);

  async function getProfilePicture(friendId: string): Promise<string> {
    const image = await fetchProfilePicture(friendId);
    return URL.createObjectURL(image);
  }
  return (
    <List>
      {users.map((user: User, index) => (
        <ListItem key={index} disablePadding sx={{ display: "flex" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              onClick={triggerDrawerOpen}
              sx={{
                minWidth: 0,
                mr: open ? 3 : 0,
                ml: !open ? 8 : 0,
                justifyContent: "center",
              }}
            >
              <StyledAvatarBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                status={user.status}
              >
                <Avatar key={user.id} src={profilePictures[user.id]} />
              </StyledAvatarBadge>
            </ListItemIcon>
            <ListItemText
              primary={user.name}
              sx={{ opacity: open ? 1 : 0 }}
              onClick={triggerDrawerOpen}
            />
            <ListItemButton
              onClick={createDmChat}
              sx={{
                opacity: open ? 1 : 0,
                color: "dodgerblue",
                width: "7px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ChatIcon />
            </ListItemButton>
            <ListItemButton
              onClick={() => deleteFriendship(user.id)}
              sx={{
                opacity: open ? 1 : 0,
                color: "red",
                width: "7px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CloseIcon />
            </ListItemButton>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
