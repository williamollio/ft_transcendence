import { Dialog, Collapse, Alert, IconButton, Tabs, Tab } from "@mui/material";
import { useState, useEffect, SyntheticEvent } from "react";
import { chatRoom } from "../../classes/chatRoom.class";
import CloseIcon from "@mui/icons-material/Close";
import CreateForm from "./CreateChannelForm";
import JoinForm from "./JoinChannelForm";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import { CRDialogValue } from "../../interfaces/chat.interfaces";

export default function AddChannelDialog({
  open,
  toggleOpen,
  channelSocket,
  toggleAlert,
  setAlertMsg,
}: {
  open: boolean;
  toggleOpen: any;
  channelSocket: ChannelSocket;
  toggleAlert: any;
  setAlertMsg: any;
}) {
  const [formSelection, setFormSelection] = useState<number>(0);

  const [dialogJoinValue, setDialogJoinValue] = useState({
    id: "",
    password: "",
  });

  const [dialogValue, setDialogValue] = useState<CRDialogValue>({
    key: "",
    access: "PUBLIC",
    password: "",
  });

  const [alert, setAlert] = useState<string>("Channel name can not be empty!");

  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  useEffect(() => {
    if (dialogValue.key === "") setAlert("Channel name can not be empty!");
    else if (dialogValue.access === "PROTECTED" && dialogValue.password === "")
      setAlert("Password can not be empty");
    else setAlertOpen(false);
  }, [dialogValue]);

  const handleFormSelection = (e: SyntheticEvent, newValue: number) => {
    setFormSelection(newValue);
  };

  const handleClose = (e: any) => {
    if (formSelection === 1)
      setDialogValue({ key: "", access: "PUBLIC", password: "" });
    else setDialogJoinValue({ id: "", password: "" });
    toggleOpen(false);
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (alertOpen === true) setAlertOpen(false);
    if (formSelection === 1) {
      setAlertMsg("Failed to create channel");
      if (dialogValue.key !== "") {
        if (dialogValue.access !== "PROTECTED" || dialogValue.password !== "") {
          if (dialogValue.access === "PROTECTED") {
            channelSocket.createRoom(
              new chatRoom(undefined, dialogValue.key, dialogValue.access),
              toggleAlert,
              dialogValue.password
            );
          } else {
            channelSocket.createRoom(
              new chatRoom(undefined, dialogValue.key, dialogValue.access),
              toggleAlert,
              undefined
            );
          }
          setDialogValue({ key: "", access: "PUBLIC", password: "" });
          toggleOpen(false);
        } else setAlertOpen(true);
      } else setAlertOpen(true);
    } else {
      setAlertMsg("Failed to join channel");
      channelSocket.joinRoom(
        dialogJoinValue.id,
        dialogJoinValue.password !== "" ? "PROTECTED" : "PUBLIC",
        toggleAlert,
        dialogJoinValue.password !== "" ? dialogJoinValue.password : undefined
      );
      setDialogJoinValue({ id: "", password: "" });
      toggleOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <>
        <Collapse in={alertOpen}>
          <Alert
            sx={{ width: "auto" }}
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alert}
          </Alert>
        </Collapse>
        <Tabs value={formSelection} onChange={handleFormSelection}>
          <Tab key={0} value={0} label="Join"></Tab>
          <Tab key={1} value={1} label="Create"></Tab>
        </Tabs>
        <form onSubmit={handleFormSubmit}>
          {formSelection === 0 ? (
            <JoinForm
              dialogJoinValue={dialogJoinValue}
              setDialogJoinValue={setDialogJoinValue}
              handleClose={handleClose}
            />
          ) : (
            <CreateForm
              dialogValue={dialogValue}
              setDialogValue={setDialogValue}
              handleClose={handleClose}
            />
          )}
        </form>
      </>
    </Dialog>
  );
}
