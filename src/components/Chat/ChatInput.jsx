import { Grid, IconButton, InputAdornment, LinearProgress, TextField } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import React, { useCallback, useState } from "react";
import "../../firebase";
import { getDatabase, push, ref, serverTimestamp, set } from "firebase/database";
import { useSelector } from "react-redux";
import Picker from "@emoji-mart/react";
import ImageModal from "../Modal/ImageModal";
import data from "@emoji-mart/data";

function ChatInput() {
  const { channel, user } = useSelector((state) => state);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);

  const handleClickOpen = useCallback(() => setImageModalOpen(true), []);

  const handleClickClose = useCallback(() => setImageModalOpen(false), []);

  const handleTogglePicker = useCallback(() => setShowEmoji((show) => !show), []);

  const handleChange = useCallback((e) => setMessage(e.target.value), []);

  const createMessage = useCallback(
    () => ({
      timestamp: serverTimestamp(),
      user: {
        id: user.currentUser.uid,
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL,
      },
      content: message,
    }),
    [message, user.currentUser.uid, user.currentUser.displayName, user.currentUser.photoURL]
  );

  const clickSendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!message) return;
      setLoading(true);
      try {
        await set(push(ref(getDatabase(), "messages/" + channel.currentChannel.id)), createMessage());
        setLoading(false);
        setMessage("");
        setShowEmoji(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [message, channel.currentChannel?.id, createMessage]
  );

  const handleSelectEmoji = useCallback((e) => {
    const sym = e.unified.split("-");
    const codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setMessage((messageValue) => messageValue + emoji);
  }, []);

  return (
    <Grid container sx={{ p: "20px" }} component="form" onSubmit={clickSendMessage}>
      <Grid item xs={12} sx={{ position: "relative" }}>
        <div style={{ position: "absolute", bottom: "80px" }}>
          {showEmoji && <Picker data={data} title="???????????? ???????????????." onEmojiSelect={handleSelectEmoji} />}
        </div>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleTogglePicker}>
                  <InsertEmoticonIcon />
                </IconButton>
                <IconButton onClick={handleClickOpen}>
                  <ImageIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={loading} onClick={clickSendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="off"
          label="????????? ??????"
          fullWidth
          value={message}
          onChange={handleChange}
        />
        {/**?????? ????????? ?????????????????? */}
        {uploading ? (
          <Grid item xs={12} sx={{ m: "10px" }}>
            <LinearProgress variant="determinate" value={percent} />
          </Grid>
        ) : null}
        <ImageModal
          open={ImageModalOpen}
          handleClose={handleClickClose}
          setPercent={setPercent}
          setUploading={setUploading}
        />
      </Grid>
    </Grid>
  );
}

export default ChatInput;
