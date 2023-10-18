import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { routes, baseRoute } from "../utils/routes";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../assets/logo2.svg";
function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, []);
  const handeSubmit = (event) => {
    event.preventDefault();
    console.log(routes.login);
    const { username, password } = values;
    axios
      .post(routes.login, { username, password })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);
        localStorage.setItem("avatar", JSON.stringify(res.data.data.user.avatar));
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Wrong username or password", toastOptions);
      });
    console.log(values);
  };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log(values);
  };
  return (
    <div>
      <FormContainer>
        <form
          action=""
          onSubmit={(event) => {
            handeSubmit(event);
          }}
        >
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1></h1>
          </div>
          <label htmlFor="username">username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            onChange={(e) => handleChange(e)}
          ></input>
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={(e) => handleChange(e)}
          ></input>
          <button type="submit">Login</button>
        </form>
      </FormContainer>
      <ToastContainer />
    </div>
  );
}
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  label {
    color: white;
    text-transform: uppercase;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
export default Login;
