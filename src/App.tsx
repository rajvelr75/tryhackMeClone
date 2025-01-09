import './App.css';
import Accordians from './components/Accordians';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopContent from './components/TopContent';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard'; 
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from './firebaseConfig';

function App() {
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // To prevent flashes of unprotected content

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ uid: user.uid, email: user.email }); 
      } else {
        setUser(null);
      }
      setIsLoading(false); // Loading state updated
    });

    return () => unsubscribe(); 
  }, []);

  // A ProtectedRoute component to handle authentication checks
  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    if (isLoading) return null; // Avoid rendering during auth check
    return user ? element : <Navigate to="/" replace />;
  };

  // An AdminRoute component for admin-only access
  const AdminRoute = ({ element }: { element: JSX.Element }) => {
    if (isLoading) return null; // Avoid rendering during auth check
    return user?.email === "rajvelr755@gmail.com" ? element : <Navigate to="/" replace />;
  };

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
              {user !== null ? <Accordians userId={user.uid} /> : <Accordians userId={undefined} />}
            </>
          }
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute element={<Profile />} />} 
        />
        <Route 
          path="/dashboard" 
          element={<AdminRoute element={<Dashboard />} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
