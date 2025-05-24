import apiClient from './apiClient';
import Cookies from 'js-cookie';

// Create a new report
export const createReport = async (formData, isAdmin = false) => {
  const headers = isAdmin
    ? { 'Content-Type': 'multipart/form-data' } // Sin autorización si es admin
    : {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get('token')}`,
      };

  return await apiClient.post('api/reports/create/', formData, { headers });
};

// Get report history (for the logged-in user)
export const getReportHistory = async (isAdmin = false) => {
  const headers = isAdmin
    ? {} // Sin autorización si es admin
    : {
        Authorization: `Bearer ${Cookies.get('token')}`,
      };

  const response = await apiClient.get('api/reports/history/', { headers });
  return response.data;
};

// Get a single report by ID
export const getReportDetail = async (reportId, isAdmin = false) => {
  const headers = isAdmin
    ? {} // Sin autorización si es admin
    : {
        Authorization: `Bearer ${Cookies.get('token')}`,
      };

  const response = await apiClient.get(`api/reports/${reportId}/`, { headers });
  return response.data;
};

// Delete a report by ID
export const deleteReport = async (reportId, isAdmin = false) => {
  const headers = isAdmin
    ? {} // Sin autorización si es admin
    : {
        Authorization: `Bearer ${Cookies.get('token')}`,
      };

  return await apiClient.delete(`api/reports/${reportId}/delete/`, { headers });
};

// Update report by ID
export const updateReportDetails = async (
  reportId,
  updatedData,
  isAdmin = false
) => {
  const headers = isAdmin
    ? { 'Content-Type': 'application/json' } 
    : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      };

  const response = await apiClient.patch(
    `api/reports/${reportId}/update/`,
    updatedData,
    { headers }
  );

  return response.data;
};

// Get report summary (most common diagnostics, total reports)
export const getReportSummary = async (isAdmin = false) => {
  const headers = isAdmin
    ? {} // Sin autorización si es admin
    : {
        Authorization: `Bearer ${Cookies.get('token')}`,
      };

  const response = await apiClient.get('api/reports/summary/', { headers });
  return response.data;
};

// Get report image
export const getReportImage = async (reportId, isAdmin = false) => {
  const headers = isAdmin
    ? {} // Sin autorización si es admin
    : {
        Authorization: `Bearer ${Cookies.get('token')}`,
      };

  const response = await apiClient.get(`api/reports/image/${reportId}/`, {
    headers,
    responseType: 'blob',
  });

  return response.data;
};