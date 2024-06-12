<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="card mt-5">
          <div class="card-header bg-danger text-white">
            <h3>Website Down</h3>
          </div>
          <div class="card-body">
            <p>
              Our website is currently down. We apologize for the inconvenience.
            </p>
            <p>Please contact the administrator for further assistance.</p>
          </div>
          <div class="card-footer">
            <button @click="contactAdmin" class="btn btn-primary">
              Contact Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    contactAdmin() {
      alert("Please contact us at cloyd.cunanan@area51.ph");
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
</style>
