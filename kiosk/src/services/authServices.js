import axios from "axios";

let BASE_URL;
if (window.location.hostname === "kiosk.ndci.edu.ph") {
  BASE_URL = `https://ndci-api.portmap.host:20300/api/`;
} else {
  BASE_URL = `http://${window.location.hostname}:20300/api/`;
}

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}users/login/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async (token) => {
  try {
    await axios.post(
      `${BASE_URL}users/logout/`,
      {},
      {
        headers: { Authorization: `Token ${token}` },
      }
    );
  } catch (error) {
    alert(error);
    console.error("Error logging out:", error);
    throw error;
  }
};
