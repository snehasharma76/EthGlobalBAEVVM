import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import JoinForm from "./components/JoinForm";
import LiveStream from "./components/LiveStream";
import TipContract from "./components/TipContract";

function App() {
  const [joined, setJoined] = useState(false);
  const [roomData, setRoomData] = useState({});

  const handleJoin = ({ roomID, userID }) => {
    setRoomData({ roomID, userID });
    setJoined(true);
  };

  return (
    <Router>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <div className="w-full h-full flex items-center justify-center">
          <Routes>
            <Route
              path="/tip"
              element={<TipContract />}
            />
            <Route
              path="/"
              element={
                joined ? (
                  <LiveStream roomID={roomData.roomID} userID={roomData.userID} />
                ) : (
                  <JoinForm onJoin={handleJoin} />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
