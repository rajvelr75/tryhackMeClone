import './App.css';
import Accordians from './components/Accordians';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopContent from './components/TopContent';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from './firebaseConfig';

function App() {
  const [userId, setUserId] = useState<string | null>(null);

  // Monitor authentication state and update userId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID from Firebase Authentication
      } else {
        setUserId(null); // Set userId to null if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
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
              {userId ? <Accordians userId={userId} /> : <div>Please log in to view the content.</div>}
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
