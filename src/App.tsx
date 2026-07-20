import { useState, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import VoiceRecord from "@/pages/VoiceRecord";
import Records from "@/pages/Records";
import Reports from "@/pages/Reports";
import Budget from "@/pages/Budget";
import Profile from "@/pages/Profile";

function AppContent() {
  const navigate = useNavigate();
  
  const handleNavigate = useCallback((page: string) => {
    const pathMap: Record<string, string> = {
      home: '/',
      voice: '/voice',
      records: '/records',
      reports: '/reports',
      budget: '/budget',
      profile: '/profile'
    };
    navigate(pathMap[page] || '/');
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home onNavigate={handleNavigate}/>}/>
      <Route path="/voice" element={<VoiceRecord onNavigate={handleNavigate}/>}/>
      <Route path="/records" element={<Records onNavigate={handleNavigate}/>}/>
      <Route path="/reports" element={<Reports onNavigate={handleNavigate}/>}/>
      <Route path="/budget" element={<Budget onNavigate={handleNavigate}/>}/>
      <Route path="/profile" element={<Profile onNavigate={handleNavigate}/>}/>
    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleRegister = () => {
    console.log('Register clicked');
  };
  
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} onRegister={handleRegister}/>;
  }
  
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;