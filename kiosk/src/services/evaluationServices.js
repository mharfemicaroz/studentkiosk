import axios from "axios";

const BASE_URL = `https://${window.location.hostname}:20300/api/`;

export const viewEvaluation = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}evaluation/view/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error retrieving schedules from database:", error);
    throw error;
  }
};
