<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md border-t-4 border-t-accent"
    >
      <i class="mdi mdi-alert-circle text-tertiary text-5xl mb-4"></i>
      <h1 class="text-2xl font-bold mb-4 text-primary-text">
        Server Unavailable
      </h1>
      <p class="mb-6 text-gray-600">
        The server is currently unreachable. The system will automatically retry
        every minute, or you can manually try again.
      </p>
      <button
        @click="retry"
        class="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-tertiary transition duration-300"
      >
        Retry
      </button>
      <p class="mt-4 text-sm text-gray-500">
        This page automatically refreshes every 60 seconds.
      </p>
    </div>
  </div>
</template>

<script>
import { verifyServer } from "../routeGuard";

export default {
  name: "NotifyPage",
  methods: {
    async retry() {
      this.$router.push("/index");
    },
    async checkServer() {
      const isAccessible = await verifyServer();
      if (isAccessible) {
        this.retry();
      }
    },
  },
  mounted() {
    this.checkServer();
    this.interval = setInterval(this.checkServer, 60000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
/* Button outline removal */
button {
  outline: none;
}

/* Custom styling using theme colors */
.bg-gray-100 {
  background-color: var(--primary-color) !important;
}

.bg-white {
  background-color: white !important;
}

.text-gray-600 {
  color: var(--primary-text) !important;
}

.text-gray-500 {
  color: var(--secondary-color) !important;
}
</style>
