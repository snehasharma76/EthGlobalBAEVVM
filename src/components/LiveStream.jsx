import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useWeb3 } from "../hooks/useWeb3";
import WalletConnect from "./WalletConnect";

const LiveStream = ({ roomID, userID }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { account } = useWeb3();

  const appID = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
  const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

  useEffect(() => {
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userID
    );

    if (token && ZegoUIKitPrebuilt) {
      const zp = ZegoUIKitPrebuilt.create(token);
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role: ZegoUIKitPrebuilt.Host,
          },
        },
        sharedLinks: [
          {
            name: "Copy Link",
            url: `${window.location.origin}?roomID=${roomID}`,
          },
        ],
      });
    }
  }, [roomID, userID]);

  const handleTipClick = () => {
    navigate("/tip", {
      state: {
        creatorAddress: account || "",
        creatorName: userID,
        roomID: roomID,
      },
    });
  };

  const handleEVVMTipClick = () => {
    navigate("/evvm-tip", {
      state: {
        creatorAddress: account || "",
        creatorName: userID,
        roomID: roomID,
      },
    });
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="w-full flex justify-between items-center p-4 bg-gray-900/80 border-b border-white/10">
        <div className="text-white font-semibold">Room: {roomID}</div>
        <WalletConnect />
      </div>
      <div
        ref={containerRef}
        className="flex-1 zego_container"
      />
      <div className="w-full flex justify-center gap-4 p-4 bg-gray-900/50">
        <button
          onClick={handleTipClick}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition duration-300 cursor-pointer shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Tip (ETH)
        </button>
        <button
          onClick={handleEVVMTipClick}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 cursor-pointer shadow-lg flex items-center gap-2"
        >
          <span>⚡</span>
          Tip via EVVM (MATE)
        </button>
      </div>
    </div>
  );
};

export default LiveStream;
