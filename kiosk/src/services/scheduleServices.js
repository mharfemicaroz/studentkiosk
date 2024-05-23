import axios from "axios";

let BASE_URL;
if (window.location.hostname === "kiosk.ndci.edu.ph") {
  BASE_URL = `https://ndci-api.portmap.io:59349/api/`;
} else {
  BASE_URL = `https://${window.location.hostname}:25856/api/`;
}

export const viewSchedule = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}schedule/view/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error retrieving schedules from database:", error);
    throw error;
  }
};
