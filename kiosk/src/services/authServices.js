import axios from "axios";

let BASE_URL;
if (window.location.hostname === "kiosk.ndci.edu.ph") {
  BASE_URL = `https://ndci-api.portmap.io:50329/api/`;
} else {
  BASE_URL = `https://${window.location.hostname}:25856/api/`;
}

export const loginUser = async (studentno, formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}users/login/${studentno}`,
      formData
    );
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

export const resetUser = async (conditions, formData) => {
  try {
    let fData = formData;
    formData = null;
    formData = { conditions: conditions, data: fData };
    const response = await axios.patch(`${BASE_URL}users/reset/`, formData);
    return response.data;
  } catch (error) {
    console.error("Error resetting password", error);
    throw error;
  }
};
