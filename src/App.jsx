import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Scenarios from "./pages/Scenario";
import Progress from "./pages/progress";
import ScenarioStart from "./pages/ScenarioStart";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scenarios"
          element={
            <ProtectedRoute>
              <Scenarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route  
          path = "/scenario/:id"
          element={
            <ProtectedRoute>
              <ScenarioStart />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}