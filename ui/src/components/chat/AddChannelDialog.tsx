import { Dialog, Collapse, Alert, IconButton, Tabs, Tab } from "@mui/material";
import { useState, useEffect, SyntheticEvent } from "react";
import { chatRoom } from "../../classes/chatRoom.class";
import CloseIcon from "@mui/icons-material/Close";
import CreateForm from "./CreateChannelForm";
import JoinForm from "./JoinChannelForm";
import { ChannelSocket } from "../../classes/ChannelSocket.class";
import {
  CRDialogValue,
  JoinDialogValue,
} from "../../interfaces/chat.interface";
import { useTranslation } from "react-i18next";
import { translationKeys } from "./constants";
import ChannelService from "../../services/channel.service";

interface Props {
  open: boolean;
  toggleOpen: any;
  channelSocket: ChannelSocket;
}

export default function AddChannelDialog(props: Props) {
  const { open, toggleOpen, channelSocket } = props;
  const { t } = useTranslation();

  const [formSelection, setFormSelection] = useState<number>(0);
  const [dialogJoinValue, setDialogJoinValue] = useState<JoinDialogValue>({
    name: "",
    password: "",
  });
  const [dialogValue, setDialogValue] = useState<CRDialogValue>({
    key: "",
    access: "PUBLIC",
    password: "",
  });
  const [alert, setAlert] = useState<string>(
    t(translationKeys.errorMessages.channelNameEmpty) as string
  );
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  useEffect(() => {
    if (dialogValue.key === "")
      setAlert(t(translationKeys.errorMessages.channelNameEmpty) as string);
    else if (dialogValue.access === "PROTECTED" && dialogValue.password === "")
      setAlert(t(translationKeys.errorMessages.passwordEmpty) as string);
    else setAlertOpen(false);
  }, [dialogValue]);

  const handleFormSelection = (e: SyntheticEvent, newValue: number) => {
    setFormSelection(newValue);
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (formSelection === 1)
      setDialogValue({ key: "", access: "PUBLIC", password: "" });
    else setDialogJoinValue({ name: "", password: "" });
    toggleOpen(false);
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (alertOpen === true) setAlertOpen(false);
    if (formSelection === 1) {
      if (dialogValue.key !== "") {
        if (dialogValue.access !== "PROTECTED" || dialogValue.password !== "") {
          if (dialogValue.access === "PROTECTED") {
            channelSocket.createRoom(
              new chatRoom(undefined, dialogValue.key, dialogValue.access),
              dialogValue.password
            );
          } else {
            channelSocket.createRoom(
              new chatRoom(undefined, dialogValue.key, dialogValue.access),
              undefined
            );
          }
          setDialogValue({ key: "", access: "PUBLIC", password: "" });
          toggleOpen(false);
        } else setAlertOpen(true);
      } else setAlertOpen(true);
    } else {
      ChannelService.getChannelByName(dialogJoinValue.name).then((resolve) => {
        console.log(resolve);
        channelSocket.joinRoom(
          resolve.id,
          dialogJoinValue.password !== "" ? dialogJoinValue.password : undefined
        );
      });
      setDialogJoinValue({ name: "", password: "" });
      toggleOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} sx={{zIndex: (theme) => theme.zIndex.modal + 2}}>
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
          <Tab
            sx={{ fontSize: "14px", fontWeight: "bold" }}
            key={0}
            value={0}
            label={t(translationKeys.buttons.join)}
          ></Tab>
          <Tab
            sx={{ fontSize: "14px", fontWeight: "bold" }}
            key={1}
            value={1}
            label={t(translationKeys.buttons.create)}
          ></Tab>
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
