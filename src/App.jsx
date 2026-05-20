import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ScenarioList from "./pages/ScenarioList";
import Progress from "./pages/progress";
import ScenarioStart from "./pages/ScenarioStart";
import ScenarioRunner from "./pages/ScenarioRunner";
import CommunityScenarioCreator from "./pages/CommunityScenarioCreator";
import CommunityScenarios from "./pages/CommunityScenarios";
import CommunityScenarioRunner from "./pages/CommunityScenarioRunner";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Private */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/scenarios" element={<ScenarioList />} />

        <Route path="/progress" element={ <Progress />} />

        {/* Difficulty Selection */}
        <Route path="/scenario/:id" element={<ScenarioStart />} />

        {/* Actual Scenario Runner */}
        <Route
          path="/scenario/:id/:difficulty"
          element={ <ScenarioRunner /> }
        />

        <Route
          path="/community/create"
          element={ <CommunityScenarioCreator/> }
        />

        <Route
          path="/community"
          element={ <CommunityScenarios /> }
        />

        <Route
          path="/community/:id"
          element={ <CommunityScenarioRunner /> } 
        />
        
        <Route
          path="/profile/:userId"
          element={ <Profile /> }
        />
        </Route>
      </Routes> 
    </Router>
  );
}