import axiosInstance from "../plugins/axiosConfig.js";

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const viewAssessment = async (formData) => {
  try {
    const response = await axiosInstance.post(`assessment/view/`, formData, {
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

export const viewPayments = async (formData) => {
  try {
    const response = await axiosInstance.post(`payments/view/`, formData, {
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

export const countExams = async (type) => {
  try {
    const response = await axiosInstance.get(`exams/count/${type}`, {
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
