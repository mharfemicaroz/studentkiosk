import initializeAxios from "../plugins/axiosConfig.js";

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const viewSYSEM = async () => {
  try {
    // Wait for the axios instance to be initialized
    const axiosInstance = await initializeAxios();
    const response = await axiosInstance.get(`config/defsysem/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving records from database:", error);
    throw error;
  }
};
