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
