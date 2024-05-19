<template>
  <div class="error-page">
    <h1>403 Error: Access Denied</h1>
    <p>You do not have permission to access this page.</p>
  </div>
</template>

<script>
export default {
  name: "403ErrorPage",
};
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 24px;
  text-align: center;
}
</style>
