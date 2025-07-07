import initializeAxios from "../plugins/axiosConfig.js";

const getToken = () => localStorage.getItem("jwtToken");

export const viewChart = async (formData) => {
  try {
    const axiosInstance = await initializeAxios();
    const res = await axiosInstance.post(
      //  ↳ backend route:  router.post("/chart/transactionReport/view", …)
      "chart/transactionReport/view",
      formData,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Error retrieving period chart data:", err);
    throw err;
  }
};

export const viewCourseChart = async (formData) => {
  try {
    const axiosInstance = await initializeAxios();
    const res = await axiosInstance.post(
      "chart/transactionsByCourse/view",
      formData,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Error retrieving course-wise chart data:", err);
    throw err;
  }
};
