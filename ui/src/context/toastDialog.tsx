import React, { SyntheticEvent } from "react";
import { makeStyles } from "tss-react/mui";
import classNames from "classnames";
import { ToastType } from "./toast";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  type?: ToastType;
  title?: string;
  message?: string;
  autoClose?: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onRefuse?: () => void;
}

const TOAST_TIMEOUT = 4000;

export default function ToastDialog(props: Props) {
  const {
    type,
    title,
    message,
    autoClose = true,
    onClose,
    onRefuse,
    onAccept,
  } = props;
  const { classes } = useStyles();

  const isSuccess = type === ToastType.SUCCESS;
  const isWarning = type === ToastType.WARNING;
  const isError = type === ToastType.ERROR;

  React.useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        onClose();
      }, TOAST_TIMEOUT);
    }
  });

  const toastBoxClasses = classNames({
    [classes.toastBox]: true,
    [classes.successBackground]: isSuccess,
    [classes.warningBackground]: isWarning,
    [classes.errorBackground]: isError,
  });

  return (
    <div className={classes.root}>
      <div className={toastBoxClasses}>
        <div>
          <h3 className={classes.text}>{title}</h3>
          <p className={classes.text}>{message}</p>
          <IconButton
            aria-label="Accept"
            color="inherit"
            size="small"
            onClick={() => {
              onClose();
              onAccept ? onAccept() : false;
            }}
          >
            <CheckIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            aria-label="Reject"
            color="inherit"
            size="small"
            onClick={() => {
              onClose();
              onRefuse ? onRefuse() : false;
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles()(() => ({
  root: {
    position: "fixed",
    right: "0.85rem",
    zIndex: "9999999",
    background: "grey",
  },

  toastBox: {
    position: "relative",
    width: "430px",
    borderRadius: "2px",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
  },

  successBackground: {
    backgroundColor: "transparentize(green, 0.2)",
  },

  warningBackground: {
    backgroundColor: "transparentize(yellow, 0.2)",
  },

  errorBackground: {
    backgroundColor: "transparentize(purple, 0.2)",
  },
  text: {
    color: "white",
    fontSize: "0.75rem",
    textTransform: "none",
  },
}));
