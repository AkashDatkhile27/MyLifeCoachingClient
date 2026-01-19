import React, { useState } from 'react';
import { ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff, Users, Loader2, Shield, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/registration.css';
import NavBar from './uiComponent/navBar';
import LogoImg from '../assests/Logo.jpg';
import userApiService from '../apiServices/userDashboardApiService';
function Registration() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    phone: '',
    countryCode: '+91', // Default Country Code
    password: ''
  });

  // Track specific field errors
  const [fieldErrors, setFieldErrors] = useState({});

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Valid Email Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
    // Specific clear for email verification error if user changes email
    if (name === 'email' && isVerified) {
        setIsVerified(false);
        setVerificationToken(null);
        setIsOtpSent(false);
    }
  };

  const handleSendOtp = async () => {
    // 1. Validation for Email Button
    if (!formData.email) {
      setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!isEmailValid) {
      setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setOtpLoading(true);
    setStatus(null);
    try {
      await userApiService.sendVerificationOtp({ email: formData.email });
      setIsOtpSent(true);
      setStatus({ type: 'success', msg: 'OTP sent to your email.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Failed to send OTP.' });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setOtpLoading(true);
    try {
      const res = await userApiService.verifyRegistrationOtp({ email: formData.email, otp });
      setVerificationToken(res.verificationToken);
      setIsVerified(true);
      setIsOtpSent(false); // Hide OTP field
      setStatus({ type: 'success', msg: 'Email Verified Successfully!' });
      // Clear email related errors
      setFieldErrors(prev => ({ ...prev, email: null }));
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Invalid OTP.' });
    } finally {
      setOtpLoading(false);
    }
  };

  // --- RAZORPAY INTEGRATION ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentAndRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    setFieldErrors({}); // Reset previous errors

    // --- 1. Verification Check ---
    if (!isVerified || !verificationToken) {
        setStatus({ type: 'error', msg: 'Please verify your email before proceeding.' });
        // Highlight email field
        setFieldErrors(prev => ({ ...prev, email: 'Verification required' }));
        setIsLoading(false);
        return;
    }

    // REMOVED: Frontend Validation Logic (Relying on backend)

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setStatus({ type: 'error', msg: 'Razorpay SDK failed to load.' });
      setIsLoading(false);
      return;
    }

    try {
      // Combine Country Code + Phone
    const fullPhone = `${formData.countryCode}${formData.phone}`;

    
      // 2. Create Order via Service (Include Verification Token & Form Data)
      // This step triggers backend validation middleware
      const orderData = await userApiService.createPaymentOrder({ 
          ...formData, 
          phone: fullPhone, // Send full phone number
          verificationToken 
      });
      // 3. Configure Razorpay Options
      const options = {
        key: orderData.key_id, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MyLifeCoaching",
        description: "15-Day Transformation Course",
        image: LogoImg, 
        order_id: orderData.order_id,
        handler: async function (response) {
          // 4. Register User on Payment Success
          await registerUser({
            ...formData,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });
        },
        prefill: {
          name: formData.Name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          customer_name: formData.Name,
          customer_email: formData.email
        },
        theme: {
          color: "#000000"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            setStatus({ type: 'error', msg: 'Payment cancelled.' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Init Error:", error);
      
      // Handle Specific Backend Validation Errors
      const msg = error.message || '';
      const newErrors = {};

      if (msg.toLowerCase().includes('email')) {
        newErrors.email = msg;
      } else if (msg.toLowerCase().includes('name')) {
        newErrors.Name = msg;
      } else if (msg.toLowerCase().includes('phone')) {
        newErrors.phone = msg;
      } else if (msg.toLowerCase().includes('password')) {
        newErrors.password = msg;
      } else {
        setStatus({ type: 'error', msg: msg || 'Payment initialization failed' });
      }
      
      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
      }

      setIsLoading(false);
    }
  };

  const registerUser = async (payload) => {
    try {
      const data = await userApiService.userRegister(payload);
      setStatus({ type: 'success', msg: 'Payment successful! Account created. Redirecting...' });
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      setFormData({ Name: '', email: '', phone: '', password: '' });
      setTimeout(() => { navigate('/dashboard'); }, 1500);
    } catch (error) {
      console.error('Registration Error:', error);
      setStatus({ type: 'error', msg: `Registration failed: ${error.message}.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>[styles]</style>
      <NavBar />
      <div className="register-page">
        <div className="register-container">
          
          {/* Left Side */}
          <div className="register-left">
            <div className="register-logo-box">
              <img src={LogoImg} alt="logo" className='logoImg-register'/>
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

            {/* Status Messages */}
            {status && (
              <div style={{
                padding: '12px', borderRadius: '8px', marginBottom: '20px', 
                backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: status.type === 'success' ? '#059669' : '#dc2626',
                fontSize: '0.9rem', textAlign: 'center',
                border: status.type === 'success' ? '1px solid #d1fae5' : '1px solid #fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                {status.type === 'error' && <AlertCircle size={16} />}
                {status.msg}
              </div>
            )}

            <form onSubmit={handlePaymentAndRegister} noValidate>
              
              {/* Full Name */}
              <div className="form-group-register">
                <label className="form-label-register">Full Name</label>
                <div className="input-with-icon-register">
                  <User size={18} className={`input-icon-register ${fieldErrors.Name ? 'error' : ''}`} />
                  <input 
                    type="text" name="Name" value={formData.Name} onChange={handleChange}
                    className={`form-input-register form-input-padded-register ${fieldErrors.Name ? 'error' : ''}`}
                    placeholder="Enter your full name" required
                  />
                </div>
                {/* Floating Tooltip Error */}
                {fieldErrors.Name && <div className="error-tooltip-register">{fieldErrors.Name}</div>}
              </div>

              {/* Email with Verification */}
              <div className="form-group-register">
                <label className="form-label-register">Email Address</label>
                <div className="input-with-icon-register">
                  <Mail size={18} className={`input-icon-register ${fieldErrors.email ? 'error' : ''}`} />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className={`form-input-register form-input-padded-register ${fieldErrors.email ? 'error' : ''}`}
                    placeholder="Enter your email address" 
                    required
                    disabled={isVerified}
                    style={isVerified ? { borderColor: '#10b981', paddingRight: '40px' } : { paddingRight: '85px' }}
                  />
                  
                  {isVerified ? (
                    <CheckCircle size={18} color="#10b981" style={{position:'absolute', right:14, top:'50%', transform:'translateY(-50%)'}}/>
                  ) : (
                    <button 
                        type="button" 
                        className="otp-action-btn"
                        onClick={handleSendOtp}
                        // Validation: Disable if email is invalid or empty
                        disabled={otpLoading || !formData.email || !isEmailValid}
                        title={!isEmailValid ? "Enter a valid email first" : "Send OTP"}
                    >
                        {otpLoading ? <Loader2 size={14} className="animate-spin"/> : 'Verify'}
                    </button>
                  )}
                </div>
                {fieldErrors.email && <div className="error-tooltip-register">{fieldErrors.email}</div>}

                {/* OTP Input Row */}
                {isOtpSent && !isVerified && (
                    <div className="otp-verify-row">
                        <input 
                            type="text" 
                            className="otp-verify-input" 
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                        <button type="button" className="otp-confirm-btn" onClick={handleVerifyOtp} disabled={otpLoading}>
                            {otpLoading ? <Loader2 size={16} className="animate-spin"/> : 'Confirm'}
                        </button>
                    </div>
                )}
              </div>

         {/* Phone with Country Code */}
              <div className="form-group-register">
                <label className="form-label-register">Phone Number</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select 
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="form-select-country"
                        style={{ width: '100px', padding: '0 8px' }}
                    >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+971">+971 (UAE)</option>
                        <option value="+61">+61 (AU)</option>
                    </select>
                    <div className="input-with-icon-register" style={{ flex: 1 }}>
                      <Phone size={18} className={`input-icon-register ${fieldErrors.phone ? 'error' : ''}`} />
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className={`form-input-register form-input-padded-register ${fieldErrors.phone ? 'error' : ''}`}
                        placeholder="Enter phone number" required
                      />
                    </div>
                </div>
                {fieldErrors.phone && <div className="error-tooltip-register">{fieldErrors.phone}</div>}
              </div>


              {/* Password */}
              <div className="form-group-register">
                <label className="form-label-register">Create Password</label>
                <div className="input-with-icon-register">
                  <Lock size={18} className={`input-icon-register ${fieldErrors.password ? 'error' : ''}`} />
                  <input 
                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                    className={`form-input-register form-input-padded-register ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Create a strong password" required
                  />
                  <button type="button" className="password-toggle-register" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <div className="error-tooltip-register">{fieldErrors.password}</div>}
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

              <button className="btn-submit-register" disabled={isLoading || !isVerified}>
                {isLoading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing Payment...</>
                ) : (
                  <> Join <ArrowRight size={18} /></>
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