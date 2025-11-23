import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage";
import BrowseStreams from "./components/BrowseStreams";
import CreatorDashboard from "./components/CreatorDashboard";
import LiveStream from "./components/LiveStream";
import TipContract from "./components/TipContract";
import EVVMTipContract from "./components/EVVMTipContract";

function StreamWrapper() {
  const location = useLocation();
  const { roomID, userID } = location.state || {};
  
  if (!roomID || !userID) {
    return <Navigate to="/browse" replace />;
  }
  
  return <LiveStream roomID={roomID} userID={userID} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowseStreams />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/stream" element={<StreamWrapper />} />
        <Route path="/tip" element={<TipContract />} />
        <Route path="/evvm-tip" element={<EVVMTipContract />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
