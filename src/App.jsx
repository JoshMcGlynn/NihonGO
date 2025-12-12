import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ScenarioList from "./pages/ScenarioList";
import Progress from "./pages/progress";
import ScenarioStart from "./pages/ScenarioStart";
import ScenarioRunner from "./pages/ScenarioRunner";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Private */}
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
              <ScenarioList />
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

        {/* Step 1: Difficulty Selection */}
        <Route
          path="/scenario/:id"
          element={
            <ProtectedRoute>
              <ScenarioStart />
            </ProtectedRoute>
          }
        />

        {/* Step 2: Actual Scenario Runner */}
        <Route
          path="/scenario/:id/:difficulty"
          element={
            <ProtectedRoute>
              <ScenarioRunner />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}