import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import '../css/login.css'; 
import NavBar from './uiComponent/navBar';
import userApiService from '../apiServices/userDashboardApiService';
function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract token and id from URL parameters
  const token = searchParams.get('token');
  const userId = searchParams.get('id');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    // Basic Validation
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', msg: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (!token || !userId) {
      setStatus({ type: 'error', msg: 'Invalid or missing reset token.' });
      setIsLoading(false);
      return;
    }

    try {
      await userApiService.resetPasswordWithEmailLink({
        userId,
        token,
        newPassword

      })
      setStatus({ type: 'success', msg: 'Password reset successful! Redirecting to login...' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
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
          
          <div className="login-left">
            <div className="login-logo-box">
              <KeyRound size={32} color="black"/>
            </div>
            <h2 className="login-headline">Set New Password</h2>
            <p className="login-sub">Create a new, strong password for your account.</p>
            <div className="login-stat">
              <Shield size={18} /> Secure Connection
            </div>
          </div>

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
                border: status.type === 'success' ? '1px solid #d1fae5' : '1px solid #fee2e2'
              }}>
                {status.msg}
              </div>
            )}

            <div className="login-form-header">
              <h2 className="login-form-title">Reset Password</h2>
              <p className="login-form-sub">Please enter your new password below.</p>
            </div>

            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input form-input-padded" 
                    placeholder="New password" 
                    required 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input form-input-padded" 
                    placeholder="Confirm new password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <button className="btn-submit" disabled={isLoading}>
                {isLoading ? <><Loader2 size={18} className="animate-spin" /> Resetting...</> : 'Reset Password'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;