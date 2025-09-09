import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyDay from './pages/MyDay';
import LateTasks from './pages/LateTasks';
import Settings from './pages/Settings';
import InBoxPage from './pages/InBoxPage';
import Important from './pages/Important';

function App() {
  const [count, setCount] = useState(0)

  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inboxpage" element={<InBoxPage />} />
          <Route path="/myday" element={<MyDay />} />
          <Route path="/latetasks" element={<LateTasks />} />
          <Route path="/important" element={<Important />} />
          <Route path="/settings" element={<Settings />} />

          {/*<Route path="*" element={<Navigate to="/login" replace />} />*/}
        </Routes>
      </Router>
  )
}

export default App