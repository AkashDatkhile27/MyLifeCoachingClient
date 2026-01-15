import { API_URL } from '../config';
const adminDashboardApiService = {
  getHeaders: (token) => ({
    'Content-Type': 'application/json',
    'token': token,
  }),

  async request(endpoint, method = 'GET', body = null, token) {
    try {
      const options = {
        method,
        headers: this.getHeaders(token),
        body: body ? JSON.stringify(body) : null
      };
      const res = await fetch(`${API_URL}${endpoint}`, options);
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `API Error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error(`Request failed: ${endpoint}`, err);
      throw err;
    }
  },

  // Auth & Users
  fetchUser: (token) => adminDashboardApiService.request('/auth/user', 'GET', null, token),
  fetchAllUsers: (token) => adminDashboardApiService.request('/admin/users', 'GET', null, token),
  createAdmin: (data, token) => adminDashboardApiService.request('/admin/create-admin', 'POST', data, token),
  deleteUser: (id, token) => adminDashboardApiService.request(`/admin/delete-users/${id}`, 'DELETE', null, token),
  // --- Updated Grant Access (Handles Boolean Grant) ---
  grantAccess: (userId, sessionId, grant, token) =>adminDashboardApiService.request(`/admin/users/${userId}/sessions/${sessionId}/grant`, 'PUT', { grant }, token),

  // Sessions
  fetchSessions: (token) => adminDashboardApiService.request('/course/sessions', 'GET', null, token),
  createSession: (data, token) => adminDashboardApiService.request('/admin/post-new-sessions', 'POST', data, token),
  updateSession: (id, data, token) => adminDashboardApiService.request(`/admin/update-sessions/${id}`, 'PUT', data, token),
  deleteSession: (id, token) => adminDashboardApiService.request(`/admin/delete-sessions/${id}`, 'DELETE', null, token),
  // Profile & Password
  updateProfile: (data, token) => adminDashboardApiService.request('/auth/update-profile', 'PUT', data, token),
  resetPassword: (data, token) => adminDashboardApiService.request('/auth/reset-password', 'PUT', data, token),
   
  fetchNotifications: (token) => adminDashboardApiService.request('/auth/notifications', 'GET', null, token),
  // --- NEW: Reflections ---
  fetchReflections: (token) => adminDashboardApiService.request('/admin/fetch-reflections', 'GET', null, token),
  replyToReflection: (data, token) => adminDashboardApiService.request('/admin/reflections/reply', 'POST', data, token),
};
export default adminDashboardApiService;