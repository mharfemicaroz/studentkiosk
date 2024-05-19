import axios from "axios";

let BASE_URL;
if (window.location.hostname === "kiosk.ndci.edu.ph") {
  BASE_URL = `https://ndci-api.portmap.host:20300/api/`;
} else {
  BASE_URL = `http://${window.location.hostname}:20300/api/`;
}

export const viewEvaluation = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}evaluation/view/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error retrieving schedules from database:", error);
    throw error;
  }
};
