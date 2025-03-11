import initializeAxios from "../plugins/axiosConfig.js";

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const viewSchedule = async (formData) => {
  try {
    const axiosInstance = await initializeAxios();
    const response = await axiosInstance.post(`schedule/view/`, formData, {
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
