import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';
import VoiceButton from './components/VoiceButton'; 
import DashboardSummary from './pages/Dashboard'; // ✅ import it here
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div className="app-description">
        EchoMind is your intelligent voice assistant that helps you manage tasks,
        set reminders, and organize notes. Simply speak your commands, and let AI handle the rest.
      </div>

      {/* Only show these on Home page */}
      {location.pathname === '/' && (
        <>
          <VoiceButton />
          <DashboardSummary /> {/* ✅ Add this */}
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </>
  );
}

export default App;
