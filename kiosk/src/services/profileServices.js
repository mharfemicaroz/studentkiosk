import axios from "axios";

const BASE_URL = `http://ndci-api.portmap.host:20300/api/`;

export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}students/${id}`);
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
