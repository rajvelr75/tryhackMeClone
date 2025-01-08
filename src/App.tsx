import './App.css';
import Accordians from './components/Accordians';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopContent from './components/TopContent';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard'; 
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from './firebaseConfig';

function App() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); 
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <TopContent />
              <Toaster position="top-right" />
              {userId !== null ? <Accordians userId={userId} /> : <Accordians userId={undefined} />}
              </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;