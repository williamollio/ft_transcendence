import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  ListItemText,
} from "@mui/material";
import { UserIds } from "../../interfaces/user.interface";
import React from "react";
import { fetchProfilePicture } from "../../utils/picture-helper";

interface Props {
  open: boolean;
  users: UserIds[];
  triggerDrawerOpen: () => void;
}
export default function ListMiniDrawer(props: Props) {
  const { open, users, triggerDrawerOpen } = props;

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
      {users.map((user: UserIds, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            onClick={triggerDrawerOpen}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Avatar key={user.id} src={profilePictures[user.id]} />
            </ListItemIcon>
            <ListItemText primary={user.name} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
