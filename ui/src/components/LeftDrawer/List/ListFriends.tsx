import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  ListItemText,
  Tooltip,
  Skeleton,
  Grid,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { User } from "../../../interfaces/user.interface";
import React from "react";
import { fetchProfilePicture } from "../../../utils/picture-helper";
import friendshipsService from "../../../services/friendships.service";
import CloseIcon from "@mui/icons-material/Close";
import { StyledAvatarBadge } from "../AvatarBadge/StyledAvatarBadge";
import { AxiosError } from "axios";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../constants";
import { useDrawersStore } from "../../../store/drawers-store";
import { useUserStore } from "../../../store/users-store";
import { BigSocket } from "../../../classes/BigSocket.class";
import { listenerWrapper } from "../../../services/initSocket.service";
import { useNavigate } from "react-router-dom";
import { UserStatus } from "../../../interfaces/user.interface";
import { user } from "../../../interfaces/chat.interface";

interface Props {
  userId: string;
  open: boolean;
  users: User[];
  bigSocket: BigSocket;
  showErrorToast: (error?: AxiosError) => void;
  showSuccessToast: (message: string) => void;
}
export default function ListFriends(props: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { userId, open, users, bigSocket, showErrorToast, showSuccessToast } =
    props;

  const navigate = useNavigate();
  const [profilePictures, setProfilePictures] = React.useState<{
    [key: string]: string;
  }>({});
  const [userStatus, setUserStatus] = React.useState<{
    [key: string]: UserStatus | UserStatus.OFFLINE;
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
  const [isRightOpen, setIsRightOpen] = useDrawersStore(
    (state: { isRightOpen: any; setIsRightOpen: any }) => [
      state.isRightOpen,
      state.setIsRightOpen,
    ]
  );
  const [isUserCacheInvalid, setIsUserCacheInvalid] = useUserStore(
    (state: { isFriendsCacheUnvalid: any; setisFriendsCacheUnvalid: any }) => [
      state.isFriendsCacheUnvalid,
      state.setisFriendsCacheUnvalid,
    ]
  );

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
    setUsersState(users);
  }

  const statusUpdateListener = (data: any) => {
    const newStatus: { [key: string]: UserStatus | UserStatus.OFFLINE } =
      Object.assign({}, userStatus);
    newStatus[data.id] = data.status;
    setUserStatus(newStatus);
  };

  const statusUpdateFullListener = (
    data: { userId: string; status: UserStatus }[]
  ) => {
    const newStatus: { [key: string]: UserStatus | UserStatus.OFFLINE } = {};
    data.forEach((element) => {
      newStatus[element.userId] = element.status;
    });
    setUserStatus(newStatus);
  };

  React.useEffect(() => {
    listenerWrapper(() => {
      if (bigSocket.socket.connected) {
        // receiving data from server
        bigSocket.socket.on("statusUpdate", statusUpdateListener);
        bigSocket.socket.on(
          "statusUpdateFullFriends",
          statusUpdateFullListener
        );
        // sending request to server
        bigSocket.status(
          users.map((element) => element.id),
          "Friends"
        );
        loadProfilePictures();
        return true;
      }
      return false;
    });
    return () => {
      listenerWrapper(() => {
        if (bigSocket.socket.connected) {
          bigSocket.socket.off("statusUpdate", statusUpdateListener);
          bigSocket.socket.off("statusUpdateFull", statusUpdateFullListener);
          return true;
        }
        return false;
      });
    };
  }, [bigSocket, users]);

  async function getProfilePicture(friendId: string): Promise<string> {
    const image = await fetchProfilePicture(friendId);
    return URL.createObjectURL(image);
  }

  function createDmChat(user: User) {
    setIsRightOpen(true);
    bigSocket.createDm(user);
  }

  async function deleteFriendship(friendId: string) {
    const responseDelete = await friendshipsService.deleteRequest(
      userId,
      friendId
    );
    const isSuccess = !responseDelete?.error;
    if (!isSuccess) {
      showErrorToast(responseDelete.error);
    } else {
      showSuccessToast(t(translationKeys.message.success.friendRemoved));
      setIsDrawerCacheInvalid(true);
      setIsUserCacheInvalid(true);
    }
  }

  function navigateToUserProfile(userId: string) {
    navigate(`/profile/${userId}`, {
      state: { user: userId },
    });
  }

  return (
    <List>
      {usersState?.map((user: User, index) => (
        <ListItem key={index} disablePadding sx={{ display: "flex" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
            }}
          >
            <Tooltip title={user.name}>
              <ListItemIcon
                onClick={() => navigateToUserProfile(user.id)}
                sx={{
                  marginLeft: -1,
                }}
              >
                <StyledAvatarBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                  status={userStatus[user.id]}
                >
                  <Avatar key={user.id} src={profilePictures[user.id]} />
                </StyledAvatarBadge>
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary={user.name} sx={{ opacity: open ? 1 : 0 }} />
            <Tooltip title="Create DM Chat">
              <ListItemButton
                onClick={() => createDmChat(user)}
                sx={{
                  opacity: open ? 1 : 0,
                  width: "7px",
                  color: theme.palette.secondary.main,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ChatIcon />
              </ListItemButton>
            </Tooltip>
            <Tooltip title="Remove friend">
              <ListItemButton
                onClick={() => deleteFriendship(user.id)}
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
            </Tooltip>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
