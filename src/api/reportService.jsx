import apiClient from './apiClient';
import Cookies from 'js-cookie';

// Create a new report
export const createReport = async (formData) => {
  const token = Cookies.get('token');

  return await apiClient.post('api/reports/create/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get report history (for the logged-in user)
export const getReportHistory = async () => {
  const token = Cookies.get('token');

  const response = await apiClient.get('api/reports/history/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get a single report by ID
export const getReportDetail = async (reportId) => {
  const token = Cookies.get('token');

  const response = await apiClient.get(`api/reports/${reportId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Delete a report by ID
export const deleteReport = async (reportId) => {
  const token = Cookies.get('token');

  return await apiClient.delete(`api/reports/${reportId}/delete/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update report comments by ID
export const updateReportComments = async (reportId, updatedComment) => {
  const token = Cookies.get('token');

  const response = await apiClient.patch(
    `api/reports/${reportId}/update/`,
    { comments: updatedComment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get report summary (most common diagnostics, total reports)
export const getReportSummary = async () => {
  const token = Cookies.get('token');

  const response = await apiClient.get('api/reports/summary/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getReportImage = async (reportId) => {
  const token = Cookies.get('token');

  const response = await apiClient.get(`api/reports/image/${reportId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });

  return response.data;
};
