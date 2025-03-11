import initializeAxios from "../plugins/axiosConfig.js";

export const loginUser = async (studentno, formData) => {
  try {
    // Wait for the axios instance to be initialized
    const axiosInstance = await initializeAxios();
    const response = await axiosInstance.post(
      `users/login/${studentno}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async (token) => {
  try {
    // Wait for the axios instance to be initialized
    const axiosInstance = await initializeAxios();
    await axiosInstance.post(
      `users/logout/`,
      {},
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
  } catch (error) {
    alert(error);
    console.error("Error logging out:", error);
    throw error;
  }
};

export const resetUser = async (conditions, formData) => {
  try {
    // Wait for the axios instance to be initialized
    const axiosInstance = await initializeAxios();
    let fData = formData;
    formData = null;
    formData = { conditions: conditions, data: fData };
    const response = await axiosInstance.post(`users/reset/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
