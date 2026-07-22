// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://digital-pintu-backend.onrender.com/api';

const request = async (path, { headers = {}, body, ...options } = {}) => {
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: requestHeaders,
    ...(body !== undefined ? { body } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const getAdminStats = () => request('/admin/stats');
export const getAdminUsers = () => request('/admin/users');
export const updateUserRole = (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
export const toggleUserStatus = (id) => request(`/admin/users/${id}/status`, { method: 'PUT' });
export const deleteUser = (id) => request(`/admin/users/${id}`, { method: 'DELETE' });
export const getAdminContacts = () => request('/admin/contacts');
export const deleteContact = (id) => request(`/admin/contacts/${id}`, { method: 'DELETE' });
export const updateContact = (id, payload) => request(`/admin/contacts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const updateReviewStatus = (id, active) => request(`/admin/reviews/${id}/status`, { method: 'PUT', body: JSON.stringify({ active }) });
// Admin always reads the complete catalogue; public services intentionally return active records only.
export const createService = (payload) => request('/admin/services', { method: 'POST', body: JSON.stringify(payload) });
export const getServices = () => request('/admin/services');
export const updateService = (id, payload) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const updateServiceStatus = (id, isActive) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify({ isActive }) });
export const deleteService = (id) => request(`/admin/services/${id}`, { method: 'DELETE' });
export const getReviews = () => request('/admin/reviews');
export const createAdminReview = (payload) => request('/admin/reviews', { method: 'POST', body: JSON.stringify(payload) });
export const deleteReview = (id) => request(`/reviews/${id}`, { method: 'DELETE' });
export const updateReview = (id, payload) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const bulkReviewStatus = (ids, active) => request('/admin/reviews/bulk-status', { method: 'PUT', body: JSON.stringify({ ids, active }) });
export const bulkDeleteReviews = (ids) => request('/admin/reviews/bulk-delete', { method: 'DELETE', body: JSON.stringify({ ids }) });
export const updateAdminUser = (id, payload) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const getVisitorTracker = () => request('/tracker/admin');
