// // const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
// // const API_BASE_URL = import.meta.env.VITE_API_URL;
// const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// const request = async (path, { headers = {}, body, ...options } = {}) => {
//   const requestHeaders = new Headers(headers);

//   if (body !== undefined && !requestHeaders.has('Content-Type')) {
//     requestHeaders.set('Content-Type', 'application/json');
//   }

//   const res = await fetch(`${API_URL}${path}`, {
//     ...options,
//     credentials: 'include',
//     headers: requestHeaders,
//     ...(body !== undefined ? { body } : {}),
//   });

//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error(data.message || 'Request failed');
//   }
//   return data;
// };

// export const getAdminStats = () => request('/admin/stats');
// export const getAdminUsers = () => request('/admin/users');
// export const updateUserRole = (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
// export const toggleUserStatus = (id) => request(`/admin/users/${id}/status`, { method: 'PUT' });
// export const deleteUser = (id) => request(`/admin/users/${id}`, { method: 'DELETE' });
// export const getAdminContacts = () => request('/admin/contacts');
// export const deleteContact = (id) => request(`/admin/contacts/${id}`, { method: 'DELETE' });
// export const updateContact = (id, payload) => request(`/admin/contacts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
// export const updateReviewStatus = (id, active) => request(`/admin/reviews/${id}/status`, { method: 'PUT', body: JSON.stringify({ active }) });
// // Admin always reads the complete catalogue; public services intentionally return active records only.
// export const createService = (payload) => request('/admin/services', { method: 'POST', body: JSON.stringify(payload) });
// export const getServices = () => request('/admin/services');
// export const updateService = (id, payload) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
// export const updateServiceStatus = (id, isActive) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify({ isActive }) });
// export const deleteService = (id) => request(`/admin/services/${id}`, { method: 'DELETE' });
// export const getReviews = () => request('/admin/reviews');
// export const createAdminReview = (payload) => request('/admin/reviews', { method: 'POST', body: JSON.stringify(payload) });
// export const deleteReview = (id) => request(`/reviews/${id}`, { method: 'DELETE' });
// export const updateReview = (id, payload) => request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
// export const bulkReviewStatus = (ids, active) => request('/admin/reviews/bulk-status', { method: 'PUT', body: JSON.stringify({ ids, active }) });
// export const bulkDeleteReviews = (ids) => request('/admin/reviews/bulk-delete', { method: 'DELETE', body: JSON.stringify({ ids }) });
// export const updateAdminUser = (id, payload) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
// export const getVisitorTracker = () => request('/tracker/admin');


const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const request = async (path, { headers = {}, body, ...options } = {}) => {
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // Admin Cookie Send Karega
    headers: requestHeaders,
    ...(body !== undefined ? { body } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// ================= Dashboard =================

export const getAdminStats = () =>
  request("/admin/stats");

// ================= Users =================

export const getAdminUsers = () =>
  request("/admin/users");

export const updateUserRole = (id, role) =>
  request(`/admin/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });

export const toggleUserStatus = (id) =>
  request(`/admin/users/${id}/status`, {
    method: "PUT",
  });

export const updateAdminUser = (id, payload) =>
  request(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteUser = (id) =>
  request(`/admin/users/${id}`, {
    method: "DELETE",
  });

// ================= Contacts =================

export const getAdminContacts = () =>
  request("/admin/contacts");

export const updateContact = (id, payload) =>
  request(`/admin/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteContact = (id) =>
  request(`/admin/contacts/${id}`, {
    method: "DELETE",
  });

// ================= Services =================

export const getServices = () =>
  request("/admin/services");

export const createService = (payload) =>
  request("/admin/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateService = (id, payload) =>
  request(`/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const updateServiceStatus = (id, isActive) =>
  request(`/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify({ isActive }),
  });

export const deleteService = (id) =>
  request(`/admin/services/${id}`, {
    method: "DELETE",
  });

export const getBlogs = () => request("/admin/blogs");
export const createBlog = (payload) => request("/admin/blogs", { method: "POST", body: JSON.stringify(payload) });
export const updateBlog = (id, payload) => request(`/admin/blogs/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const updateBlogStatus = (id, isActive) => request(`/admin/blogs/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) });
export const deleteBlog = (id) => request(`/admin/blogs/${id}`, { method: "DELETE" });

// ================= Reviews =================

export const getReviews = () =>
  request("/admin/reviews");

export const createAdminReview = (payload) =>
  request("/admin/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateReview = (id, payload) =>
  request(`/admin/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteReview = (id) =>
  request(`/admin/reviews/${id}`, {
    method: "DELETE",
  });

export const updateReviewStatus = (id, active) =>
  request(`/admin/reviews/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ active }),
  });

export const bulkReviewStatus = (ids, active) =>
  request("/admin/reviews/bulk-status", {
    method: "PUT",
    body: JSON.stringify({ ids, active }),
  });

export const bulkDeleteReviews = (ids) =>
  request("/admin/reviews/bulk-delete", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });

// ================= Visitor Tracker =================

export const getVisitorTracker = () =>
  request("/tracker/admin");

export const deleteTrackedVisitor = (id) =>
  request(`/admin/tracker/${id}`, {
    method: "DELETE",
  });

export const getSiteSettings = () => request("/site-settings/admin");

export const updateSiteSettings = (payload) =>
  request("/site-settings/admin", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getWebsitePages = () => request("/website-pages/admin");

export const createWebsitePage = (payload) =>
  request("/website-pages/admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateWebsitePage = (id, payload) =>
  request(`/website-pages/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteWebsitePage = (id) =>
  request(`/website-pages/admin/${id}`, { method: "DELETE" });

export const getCareerApplications = () => request("/career-applications/admin");

export const updateCareerApplication = (id, payload) =>
  request(`/career-applications/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteCareerApplication = (id) =>
  request(`/career-applications/admin/${id}`, { method: "DELETE" });

export const downloadCareerAttachment = async (applicationId, fieldName, fileName) => {
  const response = await fetch(`${API_URL}/career-applications/admin/${applicationId}/attachments/${encodeURIComponent(fieldName)}`, {
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Unable to download attachment");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "attachment";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const getCareerAttachmentViewUrl = (applicationId, fieldName) =>
  `${API_URL}/career-applications/admin/${applicationId}/attachments/${encodeURIComponent(fieldName)}?view=1`;
