import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../interfaces/router.interface";
import { Cookie, eraseCookie } from "../utils/auth-helper";
import { StyledAvatarBadge } from "./LeftDrawer/AvatarBadge/StyledAvatarBadge";
import { UserStatus } from "../interfaces/user.interface";

interface Props {
  image: Blob | File | null;
  status: UserStatus;
  setToken: React.Dispatch<React.SetStateAction<boolean>>;
}

enum AnchorEnum {
  SETTINGS = "SETTINGS",
  LOGOUT = "LOGOUT",
  SETUP2FA = "SETUP2FA",
}

export default function PictureMenu(props: Props) {
  const { image, status, setToken } = props;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type: AnchorEnum) => {
    switch (type) {
      case AnchorEnum.LOGOUT: {
        localStorage.removeItem(Cookie.TOKEN);
        setToken(false);
        eraseCookie(Cookie.TOKEN);
        navigate(RoutePath.LOGIN);
        break;
      }
      case AnchorEnum.SETTINGS: {
        navigate(RoutePath.EDITPROFILE, { state: { isEditMode: true } });
        break;
      }
      case AnchorEnum.SETUP2FA: {
        navigate(RoutePath.SETUP2FA);
        break;
      }
      default: {
        console.error("error in PictureMenu");
      }
    }
    setAnchorEl(null);
  };
  const triggerClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box id="container-picture" sx={{ width: "5%" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <StyledAvatarBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
              status={status}
            >
              <Avatar
                style={{
                  width: "55px",
                  height: "55px",
                }}
                src={image ? URL.createObjectURL(image) : ""}
              />
            </StyledAvatarBadge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={triggerClose}
        onClick={triggerClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 30,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleClose(AnchorEnum.SETTINGS)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem>
        <MenuItem onClick={() => handleClose(AnchorEnum.SETUP2FA)}>
          <ListItemIcon>
            <VpnKeyIcon fontSize="small" />
          </ListItemIcon>
          2FA
        </MenuItem>
        <MenuItem onClick={() => handleClose(AnchorEnum.LOGOUT)}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
