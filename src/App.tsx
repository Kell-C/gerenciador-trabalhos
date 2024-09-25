// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/Login';
import ProfessorDashboard from './components/ProfessorDashboard';
import StudentDashboard from './components/StudentDashboard';
import TaskPage from './components/TaskPage';
import Navbar from './components/Navbar';
import Register from './components/Register';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> {/* Rota específica para login */}
        <Route path="/register" element={<Register />} /> {/* Corrija a rota se necessário */}
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/estudante" element={<StudentDashboard />} />
        <Route path="/task/:id" element={<TaskPage />} />
      </Routes>
    </Router>
  );
};

export default App;
