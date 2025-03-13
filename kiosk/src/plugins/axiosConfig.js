import axios from "axios";

const CONFIG_URL = "https://area51.ph/config_ndci.json";

async function initializeAxios() {
  let axiosInstance = null;

  try {
    // Append a timestamp to force a fresh fetch each time.
    const configUrlWithCacheBuster = `${CONFIG_URL}?t=${Date.now()}`;
    const { data } = await axios.get(configUrlWithCacheBuster);
    const { ngrokUrl } = data;

    if (!ngrokUrl) {
      throw new Error("No ngrok URL found in configuration.");
    }

    console.log("Axios instance configured with:", ngrokUrl);

    axiosInstance = axios.create({
      baseURL: `${ngrokUrl}/api/`,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);

    // Fallback to default API URL from environment variables
    axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  }

  // Add an interceptor to catch response errors and trigger the toast
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If a toast reference exists on window, display the error message.
      if (window.toastRef && typeof window.toastRef.showToast === "function") {
        const errorMessage =
          error.response?.data?.message || error.message || "An error occurred";
        window.toastRef.showToast("error", errorMessage);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

export default initializeAxios;
