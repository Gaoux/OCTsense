import apiClient from './apiClient';
import Cookies from 'js-cookie';

export const predictOCT = async (imageFile) => {
  try {
    const token = Cookies.get('token');
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiClient.post('/api/oct/predict/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('OCT Prediction Error:', error);
    throw error;
  }
};

export const uploadModel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/api/oct_analysis/upload-model/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al cargar el modelo:', error);
    throw error;
  }
};
