import axiosInstance from "../plugins/axiosConfig.js";

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const viewSYSEM = async (token) => {
  try {
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
