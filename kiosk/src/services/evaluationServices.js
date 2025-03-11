import initializeAxios from "../plugins/axiosConfig.js";

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const viewEvaluation = async (formData) => {
  try {
    // Wait for the axios instance to be initialized
    const axiosInstance = await initializeAxios();
    const response = await axiosInstance.post(`evaluation/view/`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving schedules from database:", error);
    throw error;
  }
};
