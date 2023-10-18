import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo2.svg";
import jwt_decode from "jwt-decode";

export default function Contacts({ contacts, changeChat }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(undefined);
  const [selectedChat, setSelectedChat] = useState(undefined);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const token_decoded = jwt_decode(token);

    setCurrentUser(token_decoded.username);
    setCurrentUserAvatar(localStorage.getItem("avatar"));
  }, []);
  const changeCurrentChat = (index, contact) => {
    setSelectedChat(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUserAvatar && currentUserAvatar && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            {/* <h3>One on One chat</h3> */}
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact.id}
                  className={`contact ${index === selectedChat ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img src={`${contact.avatar}`} alt="broken" />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={currentUserAvatar.replace(/^"|"$/g, "")} alt="broken" />
            </div>
            <div className="username">
              <h2>{currentUser}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 7.5rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
          border-radius: 1rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
