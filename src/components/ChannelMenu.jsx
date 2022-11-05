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
import { useCallback, useEffect, useState } from "react";
import "../firebase";
import { getDatabase, push, ref, child, update, onChildAdded } from "firebase/database";
const ChannelMenu = () => {
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDetail, setChannelDetail] = useState("");
  const [channels, setChannels] = useState([]);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = useCallback(async () => {
    const db = getDatabase();
    const key = push(child(ref(db), "channels")).key; //update method 사용이다.
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
    };
    const updates = {};
    updates["/channels/" + key] = newChannel;
    try {
      await update(ref(db), updates);
      setChannelName("");
      setChannelDetail("");
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }, [channelDetail, channelName]);
  //mount 된 다음에 정보를 어떻게 가져오는가?
  useEffect(() => {
    const db = getDatabase();
    //onchildadded => unsubscribe 함수를 리턴

    const unsubscribe = onChildAdded(ref(db, "channels"), (snapshot) => {
      setChannels((channelArr) => [...channelArr, snapshot.val()]);
    }); // channels 파일에서 등록된 이벤트 발생 순간 채널들의 정보를 가져오기 위해

    return () => {
      setChannels([]);
      unsubscribe();
    };
  }, []);

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
        {
          //TODO store 구현, selected 구현
          channels.map((channel) => (
            <ListItem button key={channel.id}>
              <ListItemText primary={`# ${channel.name}`} sx={{ wordBreak: "break-all", color: "#918890" }} />
            </ListItem>
          ))
        }
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
          <Button onClick={handleSubmit}>생성</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ChannelMenu;
