import apiClient from './apiClient';

export const predictOCT = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiClient.post('/predict/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('OCT Prediction Error:', error);
    throw error;
  }
};
