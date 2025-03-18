import initializeAxios from "./plugins/axiosConfig";

export async function verifyServer() {
  // Check if the browser is offline
  if (!navigator.onLine) {
    console.warn(
      "Offline: Skipping server verification and using cached data."
    );
    return true; // or decide on your offline policy
  }

  try {
    const axiosInstance = await initializeAxios();
    const response = await axiosInstance.get("verify");
    if (response.data && response.data.access === true) {
      return true;
    }
  } catch (error) {
    console.error("Server verification failed:", error);
  }
  return false;
}
