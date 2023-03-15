import { UserStatus } from "../../../interfaces/user.interface";
import { styled, Badge } from "@mui/material";
import classes from "./styles.module.scss";

interface StyledBadgeProps {
  status?: UserStatus;
}

export const StyledAvatarBadge = styled(Badge)<StyledBadgeProps>(
  ({ theme, status }) => ({
    "& .MuiBadge-badge": {
      backgroundColor:
        status === UserStatus.ONLINE
          ? classes.colorOnline
          : status === UserStatus.PLAYING
          ? classes.colorPlaying
          : classes.colorOffline,
      color:
        status === UserStatus.OFFLINE ? classes.colorOffline : classes.white,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  })
);
