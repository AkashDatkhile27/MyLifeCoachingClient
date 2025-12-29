import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoImg from '../assests/Logo.jpg';
import { Infinity, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import '../css/login.css';
import NavBar from './uiComponent/navBar';
import userApiService from '../apiServices/userDashboardApiService';
import { API_URL } from '../config';
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const userLogin=async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    // 1. Trim Inputs
    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim()
    };
    try {
      // 2. Send data to Backend
      const response = await userApiService.userlogin(payload);
      // 3. Handle Success
      setStatus({ type: 'success', msg: 'Logged in successfully! Redirecting...' });
      // 4. Store Token & User Data
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      // 5. Redirect
      setTimeout(() => {
        const role = response.user.role;
        if (role === 'superadmin') {
          navigate('/super-admin-dashboard'); // Navigate to Super Admin Dashboard
        } else if (role === 'admin') {
          navigate('/admin');      // Navigate to Admin Dashboard
        } else {
          navigate('/dashboard');  // Navigate to User Dashboard
        }
      }, 1000);

    } catch (error) {
      console.error('Login Error:', error);
      setStatus({ type: 'error', msg: error.message || 'Credentials are invalid.' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    // 1. Trim Inputs
    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim()
    };

    try {
      // 2. Send data to Backend
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // 3. Handle Success
      setStatus({ type: 'success', msg: 'Logged in successfully! Redirecting...' });
      
      // 4. Store Token & User Data
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user)); 
      
      // 5. Redirect
      setTimeout(() => {
        const role = data.user.role;
        console.log('User role:', role);
        if (role === 'superadmin') {
          navigate('/super-admin-dashboard'); // Navigate to Super Admin Dashboard
        } else if (role === 'admin') {
          navigate('/admin');      // Navigate to Admin Dashboard
        } else {
          navigate('/dashboard');  // Navigate to User Dashboard
        }
      }, 1000);

    } catch (error) {
      console.error('Login Error:', error);
      setStatus({ type: 'error', msg: error.message || 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar/>

      <div className="login-page">
        <div className="login-container">
          
          {/* Left Side (Black) */}
          <div className="login-left">
            <div className="login-logo-box">
              <img src={LogoImg} alt="Logo" style={{width:'60px', height:'60px', objectFit:'cover', borderRadius:'10px'}} />
            </div>
            <h2 className="login-headline">Welcome Back</h2>
            <p className="login-sub">Pick up right where you left off.</p>
            <div className="login-stat">
              <Infinity size={18} /> Continue your growth
            </div>
          </div>
          
          {/* Right Side (White Form) */}
          <div className="login-right">
            <div className="login-form-header">
              <h2 className="login-form-title">Login</h2>
              <p className="login-form-sub">Welcome back! Please enter your details.</p>
            </div>

            {status && (
              <div style={{
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: status.type === 'success' ? '#059669' : '#dc2626',
                fontSize: '0.9rem',
                textAlign: 'center',
                border: status.type === 'success' ? '1px solid #d1fae5' : '1px solid #fee2e2'
              }}>
                {status.msg}
              </div>
            )}
            
            <form onSubmit={userLogin}>
              <div className="formgroup-login">
                <label className="formlabel-login">Email</label>
                <div className="inputwithicon-login">
                  <Mail size={18} className="inputicon-login" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="forminput-login forminputpadded-login" 
                    placeholder="Email" 
                    required 
                  />
                </div>
              </div>
              
              <div className="formgroup-login">
                <label className="formlabel-login">Password</label>
                <div className="inputwithicon-login">
                  <Lock size={18} className="inputicon-login" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="forminput-login forminputpadded-login" 
                    placeholder="Password" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle-login" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>
              
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px',fontSize:'0.85rem'}}>
                <label style={{display:'flex',gap:'6px', alignItems:'center', color:'#1f2937'}}>
                  <input type="checkbox" className="checkboxcustom-login"/> Remember me
                </label>
                <Link to="/forgot-password" className="link-black-login">Forgot password?</Link>
              </div>
              
              <button className="btnsubmit-login" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Signing In...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
            
            <p style={{textAlign:'center',marginTop:'20px',fontSize:'0.9rem',color:'#374151'}}>
              Don't have an account? 
              <Link to="/register" className="link-black-login" style={{marginLeft: '4px'}}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;