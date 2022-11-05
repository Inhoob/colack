import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowdropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
const ChannelMenu = () => {
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDetail, setChannelDetail] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <List sx={{ overflow: "auto", width: 240, backgroundColor: "#4c3c4c" }}>
        <ListItem
          secondaryAction={
            <IconButton sx={{ color: "#9a939b" }} onClick={handleClickOpen}>
              <AddIcon />
            </IconButton>
          }
        >
          <ListItemIcon sx={{ color: "#9a939b" }}>
            <ArrowdropDownIcon></ArrowdropDownIcon>
          </ListItemIcon>
          <ListItemText primary="채널" sx={{ wordBreak: "break-all", color: "#9a939b" }} />
        </ListItem>
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>채널 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>생성할 채널명과 설명을 입력해주세요</DialogContentText>
          <TextField autoFocus margin="dense" label="채널명" type="text" fullWidth variant="standard" onChange={(e) => setChannelName(e.target.value)} />
          <TextField margin="dense" label="설명" type="text" fullWidth variant="standard" onChange={(e) => setChannelDetail(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button>생성</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ChannelMenu;
