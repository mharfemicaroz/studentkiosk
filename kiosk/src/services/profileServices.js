import initializeAxios from "../plugins/axiosConfig.js";

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const getStudentById = async (id) => {
  try {
    const axiosInstance = await initializeAxios();
    const response = await axiosInstance.get(`students/${id}`, {
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

export const updateStudentById = async (id, formData) => {
  try {
    const axiosInstance = await initializeAxios();
    const response = await axiosInstance.patch(`students/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating records in the database:", error);
    throw error;
  }
};
