import axios from "axios";

let BASE_URL;
if (window.location.hostname === "kiosk.ndci.edu.ph") {
  BASE_URL = `https://ndci-api.portmap.io:22137/api/`;
} else {
  BASE_URL = `https://${window.location.hostname}:25856/api/`;
}

export const viewSYSEM = async () => {
  try {
    const response = await axios.get(`${BASE_URL}config/defsysem/`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving records from database:", error);
    throw error;
  }
};
