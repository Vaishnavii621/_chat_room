import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { ChatPage } from "./pages/ChatPage";
import {Register} from "./pages/Register";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route path="/chat" element={<ChatPage />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
