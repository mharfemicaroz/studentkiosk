import axios from "axios";

const BASE_URL = `http://${window.location.hostname}:8081/api/`;

export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}students/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving records from database:", error);
    throw error;
  }
};
