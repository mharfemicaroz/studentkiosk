import axios from "axios";

let BASE_URL;
if (window.location.hostname === "kiosk.ndci.edu.ph") {
  BASE_URL = `https://ndci-api.portmap.io:29956/api/`;
} else {
  BASE_URL = `https://${window.location.hostname}:25856/api/`;
}

const getToken = () => {
  return localStorage.getItem("jwtToken");
};

export const viewSYSEM = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}config/defsysem/`, {
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
