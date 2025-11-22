import React, { useState } from "react";

const JoinForm = ({ onJoin }) => {
  const [roomID, setRoomID] = useState("");
  const [userID, setUserID] = useState("");

  const handleJoin = () => {
    if (roomID && userID) {
      onJoin({ roomID, userID });
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-6 w-full max-w-sm p-8 rounded-xl shadow-xl border border-white/20 bg-white/10 backdrop-blur-md">
        <h2 className="text-center text-3xl font-semibold text-white">
          JOIN THE ROOM
        </h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          className="bg-white/10 text-white placeholder-white/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none"
        />
        <input
          type="text"
          placeholder="Enter Your User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="bg-white/10 text-white placeholder-white/50 border border-white/20 px-4 py-2 rounded-lg focus:outline-none"
        />
        <button
          onClick={handleJoin}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 cursor-pointer"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinForm;
