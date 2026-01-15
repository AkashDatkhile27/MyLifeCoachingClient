import React, { useState } from 'react';
import { ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff, Users, Loader2, Shield, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/registration.css';
import NavBar from './uiComponent/navBar';
import LogoImg from '../assests/Logo.jpg';
import { API_URL } from '../config';
import userApiService from '../apiServices/userDashboardApiService';
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

 // --- RAZORPAY INTEGRATION ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
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

    if (!formData.Name || !formData.email || !formData.password || !formData.phone) {
        setStatus({ type: 'error', msg: 'Please fill in all fields' });
        setIsLoading(false);
        return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setStatus({ type: 'error', msg: 'Razorpay SDK failed to load. Check your connection.' });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create Order via userApiService
      // Note: Passing null token as registration/payment initiation is usually public
      const orderData = await userApiService.createPaymentOrder(null);

      // 2. Configure Razorpay Options
      const options = {
        key: orderData.key_id, 
        amount: orderData.amount,
        currency: orderData.currency,
        app:"MyLifeCoaching",
        name: "MyLifeCoaching",
        description: "15-Day Transformation Course",
        // image: LogoImg, 
        order_id: orderData.order_id,
        handler: async function (response) {
          // 3. On Payment Success -> Register User
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
          customer_email: formData.email,
          customer_phone: formData.phone
        },
        theme: {
          color: "#000000"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            setStatus({ type: 'error', msg: 'Payment cancelled. Please try again.' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Init Error:", error);
      // Fallback message for demo environment if server is unreachable
      if (API_URL.includes('localhost') && error.message.includes('Failed to fetch')) {
          setStatus({ type: 'error', msg: 'Backend unreachable on localhost:5000. Start server.' });
      } else {
          setStatus({ type: 'error', msg: error.message || 'Payment initialization failed' });
      }
      setIsLoading(false);
    }
  };

  const registerUser = async (payload) => {
    try {
      // Use userApiService for registration
      const data = await userApiService.userRegister(payload);
      // Success
      setStatus({ type: 'success', msg: 'Payment successful! Creating your account...' });
      
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      
      setFormData({ Name: '', email: '', phone: '', password: '' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Registration Error:', error);
      setStatus({ type: 'error', msg: `Registration failed: ${error.message}. If money was deducted, contact support.` });
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

            {/* Payment Summary */}
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color:'#4b5563' }}>
                 <span>15-Day Course Access</span>
                 <span style={{ fontWeight: 'bold', color: '#111' }}>₹25000</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981' }}>
                 <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><CheckCircle size={14}/> Registration Fee</span>
                 <span>Included</span>
               </div>
               <div style={{color: '#111', borderTop: '1px solid #e5e7eb', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                 <span>Total Due Today</span>
                 <span>₹25000</span>
               </div>
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
                border: status.type === 'success' ? '1px solid #d1fae5' : '1px solid #fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                {status.type === 'error' && <AlertCircle size={16} />}
                {status.msg}
              </div>
            )}

            <form onSubmit={handlePaymentAndRegister}>
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
                    <Loader2 size={18} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Pay ₹25000 & Join <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '9px', fontSize: '0.95rem', color: '#4b5563' }}>
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