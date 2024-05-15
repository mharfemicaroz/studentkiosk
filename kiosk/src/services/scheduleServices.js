import axios from "axios";

const BASE_URL = `http://${window.location.hostname}:8081/api/`;

export const viewSchedule = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}schedule/view/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error retrieving schedules from database:", error);
    throw error;
  }
};
