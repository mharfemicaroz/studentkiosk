import axios from "axios";

let BASE_URL;
if (window.location.hostname === "kiosk.ndci.edu.ph") {
  BASE_URL = `https://ndci-api.portmap.io:50329/api/`;
} else {
  BASE_URL = `https://${window.location.hostname}:25856/api/`;
}

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const viewEvaluation = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}evaluation/view/`, formData, {
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
