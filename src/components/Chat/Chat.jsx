import { Divider, Grid, List, Paper, Toolbar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import "../../firebase";
import { child, get, getDatabase, onChildAdded, orderByChild, query, ref, startAt } from "firebase/database";
function Chat() {
  const { channel, user } = useSelector((state) => state);
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(); //이 부분은 62번째줄 div에 ref 로 넣고 스크롤바 구현
  useEffect(() => {
    if (!channel.currentChannel) return;
    async function getMessages() {
      const snapShot = await get(child(ref(getDatabase()), "messages/" + channel.currentChannel.id));
      setMessages(snapShot.val() ? Object.values(snapShot.val()) : []);
    }
    getMessages();
    //unmount될 때 message를 비우는 작업
    return () => {
      setMessages([]);
    };
  }, [channel.currentChannel]);

  //database에 입력이 즉각즉각 되도록 하는 작업.
  useEffect(() => {
    if (!channel.currentChannel) return;
    const sorted = query(ref(getDatabase(), "messages/" + channel.currentChannel.id), orderByChild("timestamp"));
    const unsubscribe = onChildAdded(query(sorted, startAt(Date.now())), (snapshot) =>
      setMessages((oldMessages) => [...oldMessages, snapshot.val()])
    );
    //unmount될 때마다 클린업
    return () => {
      unsubscribe?.();
    };
  }, [channel.currentChannel]);

  /**scrollIntoView는 스크롤바가 해당 div로 이동하도록 만드는것. 즉 어떤 메시지가 입력되었을 때
  스크롤바가 2초후에 부드럽게 내려오는 것을 유도한다.
  */
  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 1000);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [messages.length]);

  return (
    <>
      <Toolbar />
      <ChatHeader channelInfo={channel.currentChannel} />
      <Grid container component={Paper} variant="outlined" sx={{ mt: 3, position: "relative" }}>
        <List
          sx={{
            height: "calc(100vh - 350px)",
            overflow: "scroll",
            width: "100%",
            position: "relative",
          }}
        >
          {messages.map((message) => (
            <ChatMessage key={message.timestamp} message={message} user={user} />
          ))}
          <div ref={messageEndRef}></div>
        </List>
        <Divider />
        <ChatInput />
      </Grid>
    </>
  );
}

export default Chat;
