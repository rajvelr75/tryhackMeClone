import './App.css';
import Accordians from './components/Accordians';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopContent from './components/TopContent';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import { Toaster } from 'sonner';

function App() {
  const userId = 'someUserId';
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<><TopContent /><Toaster position="top-right" /><Accordians userId={userId} /></>} />

        <Route path="/profile" element={<Profile />} />

        <Route 
          path="/dashboard" 
          element={
            <Dashboard/>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
