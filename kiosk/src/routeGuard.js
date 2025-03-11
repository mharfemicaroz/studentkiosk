import initializeAxios from "./plugins/axiosConfig";

export async function verifyServer() {
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
