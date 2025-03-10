<template>
  <div class="row mb-3">
    <div class="col-12">
      <div class="container">
        <iframe
          :src="
            '//embed.tlk.io/ndcikiosk?nickname=' +
            fullname +
            '&theme=theme--pop'
          "
          width="100%"
          :height="iframeHeight"
          frameborder="0"
          style="margin-bottom: -8px"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      fullname: "",
      loaded: true, // Add loaded property
      iframeHeight: "500px", // Default height
    };
  },

  mounted() {
    const authStore = useAuthStore();
    this.user = authStore.user[0];
    this.fullname =
      authStore.user[0].firstname + " " + authStore.user[0].surname;

    this.updateIframeHeight();
    window.addEventListener("resize", this.updateIframeHeight);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.updateIframeHeight);
  },

  methods: {
    updateIframeHeight() {
      this.iframeHeight = `${window.innerHeight - 300}px`;
    },

    refreshPage() {
      setTimeout(() => {
        window.location.reload();
        this.loaded = false; // Ensure this happens only once
      }, 100); // Adjust timeout as needed
    },
  },

  watch: {
    loaded(newVal) {
      if (newVal) {
        this.refreshPage();
      }
    },
  },
};
</script>
