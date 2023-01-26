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
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../interfaces/router.interface";

interface Props {
  image: Blob | File | null;
}

enum AnchorEnum {
  SETTINGS = "SETTINGS",
  LOGOUT = "LOGOUT",
}

export default function PictureMenu(props: Props) {
  const { image } = props;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type: AnchorEnum) => {
    switch (type) {
      case AnchorEnum.LOGOUT: {
        // TODO : logout, delete token and bye bye
        break;
      }
      case AnchorEnum.SETTINGS: {
        navigate(RoutePath.PROFILE, { state: { isEditMode: true } });
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
            <Avatar
              style={{
                width: "55px",
                height: "55px",
              }}
              src={image ? URL.createObjectURL(image) : ""}
            />
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
              right: 14,
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
          Settings
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