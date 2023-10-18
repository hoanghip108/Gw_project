import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import axios from "axios";
import { baseRoute } from "../utils/routes";
// import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import jwt_decode from "jwt-decode";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("accessToken");

    const decoded = jwt_decode(data);
    setCurrentUser(decoded);
  }, [messages]);
  useEffect(() => {
    const data = localStorage.getItem("accessToken");
    axios
      .get(`${baseRoute}/api/conversations/${currentChat.id}`, {
        headers: { Authorization: `Bearer ${data}` },
      })
      .then((res) => {
        console.log("this is res: ", res);
        const messages = res.data.data;

        setMessages(messages);
      })
      .catch((err) => {});
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = jwt_decode(localStorage.getItem("accessToken"));
    const token = localStorage.getItem("accessToken");
    const conversation = await axios.get(
      `${baseRoute}/api/conversations/${currentChat.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("this is current chat Id: ", data.userId);
    socket.current.emit("send-msg", {
      to: currentChat.id,
      from: data.userId,
      msg,
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    await axios.post(
      `${baseRoute}/api/messages/${currentChat.id}`,
      {
        conversationId: conversation.data.data[0].conversationId,
        content: msg,
      },
      {
        headers: headers,
      }
    );
    console.log("this is msg: ", messages);
    const msgs = [...messages];
    msgs.push({ fromSelf: true, content: msg });
    console.log("this is msgs:  ", msgs);
    console.log("this is messages:  ", messages);
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, content: msg });
        console.log("this is msg: ", msg);
        console.log("this is arrivalMessage: ", arrivalMessage);
      });
    }
  }, []);

  useEffect(() => {
    console.log("this is arrivalMessage: ", arrivalMessage);
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={localStorage.getItem("avatar")} alt="" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        {/* <Logout /> */}
      </div>
      <div className="chat-messages">
        {messages.length > 0 &&
          messages.map((message) => {
            // console.log("sender: " + message.senderId + " message: " + message.content);
            // console.log("current: " + currentUser.userId);
            return (
              <div ref={scrollRef} key={message.messageId}>
                <div
                  className={`message ${
                    message.senderId === currentUser.userId ? "sended" : "recieved"
                  }`}
                >
                  <div className="content ">
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
