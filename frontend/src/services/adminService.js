import axios from 'axios';

const BASE = 'http://localhost:5000/api/admin';

// axios global auth header is set by AuthContext, no need to repeat it here

const adminService = {
  // Stats
  getDashboardStats: () => axios.get(`${BASE}/dashboard-stats`),

  // Doctor verification
  getPendingDoctors: () => axios.get(`${BASE}/doctors/pending`),
  getAllDoctors:     () => axios.get(`${BASE}/doctors/all`),
  approveDoctor:    (id) => axios.patch(`${BASE}/doctor/${id}/approve`),
  rejectDoctor:     (id, reason) => axios.patch(`${BASE}/doctor/${id}/reject`, { reason }),

  // Users
  getUsers:     (role) => axios.get(`${BASE}/users`, { params: { role } }),
  suspendUser:  (id) => axios.patch(`${BASE}/user/${id}/suspend`),
  activateUser: (id) => axios.patch(`${BASE}/user/${id}/activate`),
  deleteUser:   (id) => axios.delete(`${BASE}/delete/${id}`),

  // Analytics
  getAnalytics: () => axios.get(`${BASE}/analytics`),

  // Complaints
  getComplaints:    () => axios.get(`${BASE}/complaints`),
  resolveComplaint: (id) => axios.patch(`${BASE}/complaint/${id}/resolve`),
  deleteComplaint:  (id) => axios.delete(`${BASE}/complaint/${id}`),
};

export default adminService;
