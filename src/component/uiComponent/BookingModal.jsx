import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X,Mail, Phone, User, Loader2, AlertCircle, CheckCircle} from 'lucide-react';
import styles from'../../css/bookingModal.css';
import userApiService from './../../apiServices/userDashboardApiService';
const BookingModal = ({ isOpen, onClose }) => {
const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  if (!isOpen) return null;

  // --- 1. Load Razorpay SDK ---
  const loadRazorpay = () => {
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

  // --- 2. Handle Payment & Booking Logic ---
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Load Script
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      setStatus({ type: 'error', text: 'Failed to load payment gateway. Check internet connection.' });
      setLoading(false);
      return;
    }

    try {
      // Step A: Get Order ID from Backend via BookingService
      const orderData = await userApiService.createSessionOrder();

      // Step B: Configure Razorpay
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MyLifeCoaching",
        description: "Introduction Session Booking",
        // image: PLACEHOLDER_LOGO,
        order_id: orderData.order_id,
        // Handler triggered on successful payment
        handler: async function (response) {
          await notifyAdmin({
            ...formData,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
          });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatus({ type: 'error', text: 'Payment cancelled.' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      // if (API_URL.includes('localhost') && err.message.includes('Failed to fetch')) {
      //     setStatus({ type: 'error', text: 'Backend unreachable. Ensure server is running on localhost:5000' });
      // } else {
      //     setStatus({ type: 'error', text: err.message || 'Failed to initiate booking.' });
      // }
      setLoading(false);
    }
  };

  // --- 3. Notify Admin (After Payment) ---
  const notifyAdmin = async (bookingDetails) => {
    try {
      // Notify backend to send email and generate invoice
    await userApiService.notifyAdminBooking({ 
        ...bookingDetails,
        amount: 199,
        date: new Date().toLocaleDateString(), 
        sendInvoice: true // Flag for backend
      });
      
      setStatus({ type: 'success', text: 'Booking Successful! Invoice sent to your email.' });
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
        setStatus(null);
        setFormData({ name: '', email: '', phone: '' });
      }, 3500);

    } catch (error) {
      // Payment succeeded but email failed - still show success for user peace of mind
      console.error("Email notification failed:", error);
      setStatus({ type: 'success', text: 'Payment successful! We will contact you shortly.' });
      setTimeout(onClose, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>[styles]</style>
      <div className="booking-modal-overlay" onClick={onClose}>
        <div className="booking-modal-content" onClick={e => e.stopPropagation()}>
          <button className="booking-modal-close" onClick={onClose}><X size={20} /></button>
          
          <div className="booking-modal-header">
            <h2 className="booking-modal-title">Book First Session</h2>
            <p className="booking-modal-sub">Start your journey from Chaos to Clarity.</p>
          </div>

          <div className="booking-summary">
            <div className="booking-summary-row">
              <span className="booking-summary-label">Session Type</span>
              <span className="booking-summary-value">Demo / Intro Call</span>
            </div>
            <div className="booking-summary-row booking-summary-total">
              <span className="booking-summary-label">Total to Pay</span>
              <span className="booking-summary-value">₹199.00</span>
            </div>
          </div>

          {status && (
            <div className={`status-message ${status.type === 'error' ? 'status-error' : 'status-success'}`}>
              {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              {status.text}
            </div>
          )}

          <form onSubmit={handleBooking}>
            <div className="booking-form-group">
              <label className="booking-form-label">Full Name</label>
              <div className="booking-input-wrapper">
                <User size={18} className="booking-input-icon" />
                <input 
                  type="text" 
                  className="booking-form-input" 
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="booking-form-group">
              <label className="booking-form-label">Email Address</label>
              <div className="booking-input-wrapper">
                <Mail size={18} className="booking-input-icon" />
                <input 
                  type="email" 
                  className="booking-form-input" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="booking-form-group">
              <label className="booking-form-label">Phone Number</label>
              <div className="booking-input-wrapper">
                <Phone size={18} className="booking-input-icon" />
                <input 
                  type="tel" 
                  className="booking-form-input" 
                  placeholder="Enter your phone" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="booking-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Processing...
                </>
              ) : (
                'Pay ₹199 & Book'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingModal;