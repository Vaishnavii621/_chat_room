import React from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BsBoxArrowLeft } from "react-icons/bs";
import io from "socket.io-client";
//const socket = io(import.meta.env.VITE_SOCKET_URL);
const socket = io.connect("http://localhost:5000");

const Header = () => {
  const navigate = useNavigate();
  const username = Cookies.get("username");

  const logoutHandler = () => {
    socket.emit("user-loggedout", username);
    Cookies.remove("jwtToken");
    Cookies.remove("user_id");
    Cookies.remove("username");
    navigate("/");
  };

  return (
    <nav>
      <h4 style={{ color: "#800080" }}>
        {username || "Chat_app"}
      </h4>
      <div className="logout" onClick={logoutHandler}>
        <input
          type="button"
          value="Logout"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: "15px",
          }}
        />
        <BsBoxArrowLeft />
      </div>
    </nav>
  );
};

export default Header;
