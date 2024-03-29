import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Avatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { User, UserStatus } from "../../../interfaces/user.interface";
import React from "react";
import { fetchProfilePicture } from "../../../utils/picture-helper";
import CloseIcon from "@mui/icons-material/Close";
import friendshipsService from "../../../services/friendships.service";
import { StyledAvatarBadge } from "../AvatarBadge/StyledAvatarBadge";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../constants";
import { useDrawersStore } from "../../../store/drawers-store";
import { useUserStore } from "../../../store/users-store";
import { BigSocket } from "../../../classes/BigSocket.class";
import { listenerWrapper } from "../../../services/initSocket.service";
import { useNavigate } from "react-router-dom";

interface Props {
  userId: string;
  open: boolean;
  users: User[];
  bigSocket: BigSocket;
  showErrorToast: (error?: AxiosError) => void;
  showSuccessToast: (message: string) => void;
}
export default function ListRequested(props: Props) {
  const { userId, open, users, bigSocket, showErrorToast, showSuccessToast } =
    props;

  const navigate = useNavigate();
  const { t } = useTranslation();
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
		loadProfilePictures();
        // receiving data from server
        bigSocket.socket.on("statusUpdate", statusUpdateListener);
        bigSocket.socket.on("statusUpdateFullRequested", statusUpdateFullListener);
        // sending request to server
        bigSocket.status(users.map((element) => element.id), "Requested");
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
      setIsDrawerCacheInvalid(true);
      setIsUserCacheInvalid(true);
    }
  }

  function navigateToUserProfile(userId: string) {
    navigate(`/profile/${userId}`, { state: { user: userId } });
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
            <Tooltip title={user.name}>
              <ListItemIcon
                onClick={() => navigateToUserProfile(user.id)}
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
            </Tooltip>
            <ListItemText primary={user.name} sx={{ opacity: open ? 1 : 0 }} />
            <Tooltip title="Cancel friendship request">
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
            </Tooltip>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
