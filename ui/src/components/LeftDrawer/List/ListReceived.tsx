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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import friendshipsService from "../../../services/friendships.service";
import { StyledAvatarBadge } from "../AvatarBadge/StyledAvatarBadge";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../constants";
import { useDrawersStore } from "../../../store/drawers-store";
import { useUserStore } from "../../../store/users-store";
import { UserSocket } from "../../../classes/UserSocket.class";
import { listenerWrapper } from "../../../services/initSocket.service";

interface Props {
  userId: string;
  open: boolean;
  users: User[];
  userSocket: UserSocket;
  triggerDrawerOpen: () => void;
  showErrorToast: (error?: AxiosError) => void;
  showSuccessToast: (message: string) => void;
}
export default function ListReceived(props: Props) {
  const {
    userId,
    open,
    users,
    userSocket,
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
  const [isDrawerCacheInvalid, setIsDrawerCacheInvalid] = useDrawersStore(
    (state: { isFriendsCacheUnvalid: any; setisFriendsCacheUnvalid: any }) => [
      state.isFriendsCacheUnvalid,
      state.setisFriendsCacheUnvalid,
    ]
  );
  const [isUserCacheInvalid, setIsUserCacheInvalid] = useUserStore(
    (state: { isFriendsCacheUnvalid: any; setisFriendsCacheUnvalid: any }) => [
      state.isFriendsCacheUnvalid,
      state.setisFriendsCacheUnvalid,
    ]
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

  React.useEffect(() => {
    listenerWrapper(() => {
      if (userSocket.socket.connected) {
        // receiving data from server
        userSocket.socket.on("statusRequest", (data) => {
          const newList: User[] = new Array<User>();
          users?.forEach((element) => newList.push(element));
          const index = newList.findIndex((element) => element.id === data.id);
          if (index !== -1) {
            newList[index].status = data.status;
          }
          setUsersState(newList);
        });
        // sending request to server
        for (const user of users) {
          userSocket.status(user.id);
        }
        return true;
      }
      return false;
    });
  }, [userSocket, users]);

  async function getProfilePicture(friendId: string): Promise<string> {
    const image = await fetchProfilePicture(friendId);
    return URL.createObjectURL(image);
  }

  async function acceptRequestReceived(friendId: string) {
    const responseAccept = await friendshipsService.patchAccept(
      userId,
      friendId
    );
    const isSuccess = !responseAccept?.error;
    if (!isSuccess) {
      showErrorToast(responseAccept.error);
    } else {
      showSuccessToast(t(translationKeys.message.success.requestAccepted));
      setIsDrawerCacheInvalid(true);
      setIsUserCacheInvalid(true);
    }
  }

  async function cancelRequestReceived(friendId: string) {
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
            <ListItemText
              primary={user.name}
              sx={{ opacity: open ? 1 : 0 }}
              onClick={triggerDrawerOpen}
            />
            <ListItemButton
              onClick={() => acceptRequestReceived(user.id)}
              sx={{
                opacity: open ? 1 : 0,
                color: "limegreen",
                width: "7px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CheckIcon />
            </ListItemButton>
            <ListItemButton
              onClick={() => cancelRequestReceived(user.id)}
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
