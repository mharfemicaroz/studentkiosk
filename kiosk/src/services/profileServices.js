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

export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}students/${id}`, {
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
    const response = await axios.patch(`${BASE_URL}students/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating records in the database:", error);
    throw error;
  }
};
