import axios from "axios";

const BASE_URL = `http://ndci-api.portmap.host:20300/api/`;

export const viewSYSEM = async () => {
  try {
    const response = await axios.get(`${BASE_URL}config/defsysem/`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving records from database:", error);
    throw error;
  }
};
