import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import LogoImg from '../assests/Logo.jpg'; // Keep if you use it in other parts of the layout
import { Shield, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import '../css/login.css';
import NavBar from './uiComponent/navBar';
import userApiService from '../apiServices/userDashboardApiService';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', msg: string }

  const handleRequestLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const trimmedEmail = email.trim();

    try {
      await userApiService.forgotPassword(trimmedEmail);

      setStatus({ 
        type: 'success', 
        msg: `Reset link sent to ${trimmedEmail}. Please check your inbox (and spam folder).` 
      });    

    } catch (error) {
      // Handle network errors
      const errorMsg = error.message === 'Failed to fetch' 
        ? 'Unable to connect to server.' 
        : error.message;
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="login-page">
        <div className="login-container">
          
          {/* Left Side (Black) */}
          <div className="login-left">
            <div className="login-logo-box">
              <Shield size={32} color="black"/>
            </div>
            <h2 className="login-headline">Secure Recovery</h2>
            <p className="login-sub">We help you recover access to your account securely via email verification.</p>
            <div className="login-stat">
              <Shield size={18} /> Data Encrypted
            </div>
          </div>

          {/* Right Side (White Form) */}
          <div className="login-right">
            
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
                {status.type === 'success' && <CheckCircle2 size={16}/>}
                {status.msg}
              </div>
            )}

            {!status?.type || status.type === 'error' ? (
              <>
                <div className="login-form-header">
                  <h2 className="login-form-title">Forgot Password?</h2>
                  <p className="login-form-sub">Enter your email to receive a password reset link.</p>
                </div>

                <form onSubmit={handleRequestLink}>
                  <div className="formgroup-login">
                    <label className="formlabel-login">Email Address</label>
                    <div className="inputwithicon-login">
                      <Mail size={18} className="inputicon-login" />
                      <input 
                        type="email" 
                        className="forminput-login forminputpadded-login" 
                        placeholder="Enter your registered email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button className="btnsubmit-login" disabled={isLoading}>
                    {isLoading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              // Success View
              <div style={{textAlign: 'center', padding: '20px 0'}}>
                 <p className="login-form-sub">
                   Link sent successfully! You can close this tab or return to login.
                 </p>
              </div>
            )}

            <p style={{textAlign:'center', marginTop:'20px', fontSize:'0.9rem'}}>
              <Link to="/login" className="link-black-login" style={{display:'inline-flex', alignItems:'center', gap:'6px'}}>
               <ArrowLeft size={16}/> Back to Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;