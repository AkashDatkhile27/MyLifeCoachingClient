import './App.css';
import HomePage from './component/homePage';
import About from './component/aboutPage';
import Program from './component/program';
import Contact from './component/contact';
import Register from './component/registration';
import Login from './component/login';
import ForgotPass from './component/forgotPassword';
import ResetPassword from './component/resetPassword';
import Dashboard from './component/userComponent/userDashboard';
import AdminDashboard from './component/adminComponent/superAdminDashboard';


import './index.css';




import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React,{useEffect,useState} from 'react';

function App() {
  // --- LENIS SMOOTH SCROLLING SETUP ---
 const [installPrompt, setInstallPrompt] = useState(null);

  // --- PWA: REGISTER SERVICE WORKER ---
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // --- PWA: INSTALL PROMPT LISTENER ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    // Show the install prompt
    installPrompt.prompt();
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  // --- LENIS SMOOTH SCROLLING SETUP ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js";
    script.async = true;
    script.onload = () => {
      const lenis = new window.Lenis({
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      window.lenis = lenis;
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);


  // --- SCROLL RESET ON NAVIGATION ---
  useEffect(() => {
    // If Lenis is active, use it to scroll to top immediately
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      // Fallback if Lenis isn't loaded yet
      window.scrollTo(0, 0);
    }
  }, []);
  return (
    <>
    <Router>
      {/* The Routes container decides which component to show based on the URL */}
      <Routes>
        {/* Landing Screen: path="/" */}
        <Route path="/" element={<HomePage />} />
        
        {/* Other component */}
        <Route path="/about" element={<About />} />
        <Route path="/program" element={<Program />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password-with-link" element={<ResetPassword />} />
        <Route path="/super-admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
