import { defineStore } from "pinia";
import { loginUser, logoutUser } from "@/services/authServices";

// Utility function to load persisted state from localStorage
function loadState(key) {
  const stateValue = localStorage.getItem(key);
  return stateValue ? JSON.parse(stateValue) : null;
}

// Utility function to save state to localStorage
function saveState(key, state) {
  localStorage.setItem(key, JSON.stringify(state));
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: loadState("user"), // Load the persisted user state from localStorage
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    token(state) {
      return state.user ? state.user.token : null;
    },
  },
  actions: {
    setUser(userData) {
      this.user = userData;
      saveState("user", userData); // Save the user state to localStorage
    },
    async login(formData) {
      try {
        const { user, token } = await loginUser(formData);
        this.setUser({ ...user, token: token });
        return true;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      try {
        await logoutUser(this.user.token);
        // Perform any necessary cleanup or state changes after logout
        this.user = null;
        saveState("user", null); // Remove the user state from localStorage
      } catch (error) {
        // Handle error
      }
    },
  },
});
