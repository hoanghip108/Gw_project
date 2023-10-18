import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { routes, baseRoute } from "../utils/routes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import jwt_decode from "jwt-decode";
export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [currentUser, setCurrentUser] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
    const decoded = jwt_decode(token);

    setCurrentUser(decoded);
  }, []);
  useEffect(() => {
    if (currentUser) {
      console.log("this is currentUser", currentUser);
      socket.current = io(baseRoute);
      socket.current.emit("add-user", currentUser.userId);
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      console.log("currentUser", currentUser);
      axios
        .get(routes.getContacts, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        })
        .then((res) => {
          const contacts = res.data.data;
          const contactsArr = contacts.reduce(function (result, contact) {
            if (contact.username !== currentUser.username) {
              result.push(contact);
            }
            return result;
          }, []);
          setContacts(contactsArr);
        })
        .catch((err) => {
          if (err.response.status === 403) {
            axios
              .post(`${baseRoute}/api/users/auth/refreshtoken`, {
                refreshToken: localStorage.getItem("refreshToken"),
              })
              .then((res) => {
                localStorage.setItem("accessToken", res.data.data.accessToken);
                localStorage.setItem("refreshToken", res.data.data.newRefreshToken);
              });
          }
        });
    }
  }, [currentUser]);
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
