import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  ListItemText,
} from "@mui/material";
import { User } from "../../../interfaces/user.interface";
import React from "react";
import { fetchProfilePicture } from "../../../utils/picture-helper";
import CloseIcon from "@mui/icons-material/Close";
import friendshipsService from "../../../services/friendships.service";
import { StyledAvatarBadge } from "../AvatarBadge/StyledAvatarBadge";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../constants";

interface Props {
  userId: string;
  open: boolean;
  users: User[];
  triggerDrawerOpen: () => void;
  showErrorToast: (error?: AxiosError) => void;
  showSuccessToast: (message: string) => void;
}
export default function ListRequested(props: Props) {
  const {
    userId,
    open,
    users,
    triggerDrawerOpen,
    showErrorToast,
    showSuccessToast,
  } = props;

  const { t } = useTranslation();
  const [profilePictures, setProfilePictures] = React.useState<{
    [key: string]: string;
  }>({});
  const [usersState, setUsersState] = React.useState<User[] | undefined>(
    undefined
  );

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
    setUsersState(users);
  }, [users]);

  async function getProfilePicture(friendId: string): Promise<string> {
    const image = await fetchProfilePicture(friendId);
    return URL.createObjectURL(image);
  }

  async function cancelRequestSent(friendId: string) {
    const responseDelete = await friendshipsService.deleteRequest(
      userId,
      friendId
    );
    const isSuccess = !responseDelete?.error;
    if (!isSuccess) {
      showErrorToast(responseDelete.error);
    } else {
      showSuccessToast(t(translationKeys.message.success.requestDeleted));
      const tmpUsers = users.filter((user) => friendId !== user.id);
      setUsersState(tmpUsers);
    }
  }

  return (
    <List>
      {usersState?.map((user: User, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
            }}
          >
            <ListItemIcon
              onClick={triggerDrawerOpen}
              sx={{
                marginLeft: -1,
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
            <ListItemText primary={user.name} sx={{ opacity: open ? 1 : 0 }} />
            <ListItemButton
              onClick={() => cancelRequestSent(user.id)}
              sx={{
                opacity: open ? 1 : 0,
                color: "lightcoral",
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
