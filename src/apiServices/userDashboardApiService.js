import { API_URL } from '../config';
const userApiService = {
  getHeaders: (token) => ({ 'Content-Type': 'application/json', 'token': token }),

  async request(endpoint, method = 'GET', body = null, token) {
    try {
      const options = {
        method,
        headers: this.getHeaders(token),
        body: body ? JSON.stringify(body) : null
      };
      
      const res = await fetch(`${API_URL}${endpoint}`, options);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expired.");
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`Request failed: ${endpoint}`, err);
      throw err;
    }
  },

// --- AUTHENTICATION ---
  userlogin: (data) => userApiService.request('/auth/login', 'POST', data),
  verifyOtp: (data) => userApiService.request('/auth/verify-otp', 'POST', data), // Login 2FA
  
  // --- PRE-REGISTRATION VERIFICATION (Added) ---
  sendVerificationOtp: (data) => userApiService.request('/auth/send-verification-otp', 'POST', data),
  verifyRegistrationOtp: (data) => userApiService.request('/auth/verify-registration-otp', 'POST', data),

  // --- REGISTRATION ---
  userRegister: (data) => userApiService.request('/auth/register', 'POST', data),

  // --- PASSWORD MANAGEMENT ---
  forgotPassword: (email) => userApiService.request('/auth/forgot-password', 'POST', { email }),
  resetPassword: (data, token) => userApiService.request('/auth/reset-password', 'POST', data, token),
  resetPasswordWithEmailLink: (data, token) => userApiService.request('/auth/reset-password-with-link', 'POST', data, token),

  // --- USER DATA ---
  fetchUser: (token) => userApiService.request('/auth/user', 'GET', null, token),
  updateProfile: (data, token) => userApiService.request('/auth/update-profile', 'PUT', data, token),
  
  // --- DASHBOARD ---
  fetchSessions: (token) => userApiService.request('/course/sessions', 'GET', null, token),
  completeSession: (sessionId, token) => userApiService.request(`/course/sessions/${sessionId}/complete`, 'PUT', { isCompleted: true }, token),
  requestAccess: (sessionId, token) => userApiService.request('/course/request-access', 'POST', { sessionId }, token),
  fetchNotifications: (token) => userApiService.request('/auth/notifications', 'GET', null, token),
  
  // --- REFLECTIONS ---
  fetchReflections: (token) => userApiService.request('/auth/fetch-reflections', 'GET', null, token),
  createOrUpdateReflection: (data, token) => userApiService.request('/auth/create-reflections', 'POST', data, token),

  // --- PAYMENTS ---
  // Note: createPaymentOrder now accepts userData for backend validation
  createPaymentOrder: (userData) => userApiService.request('/auth/create-order', 'POST', userData),
  createSessionOrder: (userData) => userApiService.request('/auth/create-session-order', 'POST', userData),
  notifyAdminBooking: (data) => userApiService.request('/auth/notify-admin-booking', 'POST', data),
};

export default userApiService;