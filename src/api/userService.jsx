import apiClient from "./apiClient";
import Cookies from "js-cookie";

export const loginUser = async (email, password) => {
  const response = await apiClient.post(
    "/api/users/login/",
    { email, password },
    { withCredentials: true }
  );

  const { user, access } = response.data;

  return { user, token: access };
};

export const registerUser = async (form) => {
  const response = await apiClient.post(
    "/api/users/register/",
    {
      email: form.email,
      password: form.password,
      name: form.name,
      profession: form.role,
    },
    { withCredentials: true }
  );

  return response.data;
};

export const updateUser = async (userData) => {
  try {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    console.log(userData);
    const response = await apiClient.patch("/api/users/profile/", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};