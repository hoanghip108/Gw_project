import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import jwt_decode from "jwt-decode";

export default function Welcome() {
  const [userName, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const decoded = jwt_decode(token);
    setUsername(decoded.username);
    setAvatar(decoded.avatar);
  }, [setUsername, setAvatar]);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <img src={avatar} alt=""></img>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
