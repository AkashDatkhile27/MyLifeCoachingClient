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

  userlogin: (data) => userApiService.request('/auth/login', 'POST', data),
  userRegister: (data) => userApiService.request('/auth/register', 'POST', data),
  fetchUser: (token) => userApiService.request('/auth/user', 'GET', null, token),
  fetchSessions: (token) => userApiService.request('/course/sessions', 'GET', null, token),
  completeSession: (sessionId, token) =>    userApiService.request(`/course/sessions/${sessionId}/complete`, 'PUT', { isCompleted: true }, token),
  updateProfile: (data, token) => userApiService.request('/auth/update-profile', 'PUT', data, token),
  resetPassword: (data, token) => userApiService.request('/auth/reset-password', 'POST', data, token),
  resetPasswordWithEmailLink: (data, token) => userApiService.request('/auth/reset-password-with-link', 'POST', data, token),
  forgotPassword: (email) => userApiService.request('/auth/forgot-password', 'POST', { email }),
  
  // --- NEW ENDPOINTS ---
  requestAccess: (sessionId, token) => userApiService.request('/course/request-access', 'POST', { sessionId }, token),
  fetchNotifications: (token) => userApiService.request('/auth/notifications', 'GET', null, token),
};

export default userApiService;