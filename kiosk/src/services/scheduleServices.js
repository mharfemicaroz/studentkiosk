import axios from "axios";

const BASE_URL = `https://ndci-api.portmap.host:20300/api/`;

export const viewSchedule = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}schedule/view/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error retrieving schedules from database:", error);
    throw error;
  }
};
