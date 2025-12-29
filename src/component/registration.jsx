import React, { useState } from 'react';
import { ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff, Users, Loader2, Shield, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/registration.css';
import NavBar from './uiComponent/navBar';
import LogoImg from '../assests/Logo.jpg';
import { API_URL } from '../config';
function Registration() {
   const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    phone: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    // 1. Prepare Payload (Trim inputs)
    const payload = {
      Name: formData.Name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password.trim()
    };

    try {
      // 2. Send data to Node.js Backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // FIX: Handle non-JSON responses (like "Server Error") safely
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        // If parsing fails, use the raw text as the error message
        throw new Error(responseText || 'Server returned an invalid response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // 3. Handle Success (Auto-Login based on Backend Token)
      setStatus({ type: 'success', msg: 'Registration & Payment successful! Redirecting to dashboard...' });
      
      // Store Token & User Data (Backend returns these on successful register)
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      
      // Clear form
      setFormData({ Name: '', email: '', phone: '', password: '' });
      
      // 5. Redirect to Dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Registration Error:', error);
      // Handle network errors specifically
      const errorMsg = error.message === 'Failed to fetch' 
        ? 'Unable to connect to server. Is the backend running?' 
        : error.message;
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <NavBar />
      <div className="register-page">
        <div className="register-container">
          
          {/* Left Side */}
          <div className="register-left">
            <div className="register-logo-box">
            <img src={LogoImg} alt="logo" className='logoImg'/>
           
            </div>
            <h2 className="reg-headline">Begin Your Journey</h2>
            <p className="reg-sub">
              Transform your life in 15 days. Join thousands who have found clarity, purpose, and inner strength.
            </p>
            <div className="reg-stat">
              <Users size={18} /> 2,500+ Lives transformed
            </div>
          </div>

          {/* Right Side */}
          <div className="register-right">
            <div className="reg-form-header">
              <h2 className="reg-form-title">Create Account</h2>
              <p className="reg-form-sub">Start your transformation journey today</p>
            </div>

            {/* Payment Summary - Using inline styles to match aesthetic as specific class wasn't in CSS
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color:'#4b5563' }}>
                 <span>15-Day Course Access</span>
                 <span style={{ fontWeight: 'bold', color: '#111' }}>$199.00</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981' }}>
                 <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><CheckCircle size={14}/> Registration Fee</span>
                 <span>Included</span>
               </div>
               <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                 <span>Total Due Today</span>
                 <span>$199.00</span>
               </div>
            </div> */}

            {status && (
              <div style={{
                padding: '12px', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: status.type === 'success' ? '#059669' : '#dc2626',
                fontSize: '0.9rem',
                textAlign: 'center',
                border: status.type === 'success' ? '1px solid #d1fae5' : '1px solid #fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                {status.type === 'error' && <AlertCircle size={16} />}
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group-register">
                <label className="form-label-register">Full Name</label>
                <div className="input-with-icon-register">
                  <User size={18} className="input-icon-register" />
                  <input 
                    type="text" 
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    className="form-input-register form-input-padded-register" 
                    placeholder="Enter your full name" 
                    required
                  />
                </div>
              </div>

              <div className="form-group-register">
                <label className="form-label-register">Email Address</label>
                <div className="input-with-icon-register">
                  <Mail size={18} className="input-icon-register" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input-register form-input-padded-register" 
                    placeholder="Enter your email address" 
                    required
                  />
                </div>
              </div>

              <div className="form-group-register">
                <label className="form-label-register">Phone Number</label>
                <div className="input-with-icon-register">
                  <Phone size={18} className="input-icon-register" />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input-register form-input-padded-register" 
                    placeholder="Enter your phone number" 
                    required
                  />
                </div>
              </div>

              <div className="form-group-register">
                <label className="form-label-register">Create Password</label>
                <div className="input-with-icon-register">
                  <Lock size={18} className="input-icon-register" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input-register form-input-padded-register" 
                    placeholder="Create a strong password" 
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle-register"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#9ca3af' }}>
                   • 8+ characters • Uppercase • Number
                </div>
              </div>

              <div className="checkbox-group-register">
                <input type="checkbox" id="terms" className="checkbox-custom-register" required />
                <label htmlFor="terms" className="checkbox-label-register">
                  I agree to the <Link to="/terms" className="link-black-register">Terms of Service</Link> and <Link to="/privacy" className="link-black-register">Privacy Policy</Link>
                </label>
              </div>

              <button className="btn-submit-register" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    Pay $199 & Join <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.95rem', color: '#4b5563' }}>
              Already a member? <Link to="/login" className="link-black-register">Login</Link>
            </p>

            <div className="trust-badges-register">
              <div className="trust-item-register"><Shield size={14} color="#6b7280" /> SSL Secured</div>
              <div className="trust-item-register"><Lock size={14} color="#6b7280" /> Privacy Protected</div>
              <div className="trust-item-register"><Clock size={14} color="#6b7280" /> 24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;