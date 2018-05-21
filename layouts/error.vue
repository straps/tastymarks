<template>
  <section class="container">
    <img src="/images/logo/logo-192.png" alt="TastyMarks Logo" class="logo" />
    <h1 class="title">
      Error {{ error.statusCode }}: {{ error.message }}
    </h1>
    <v-btn class="primary mx-0 my-2" to="/" v-if="error.statusCode === 404">
      Return to Homepage
    </v-btn>
  </section>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style scoped>
.title {
  margin-top: 15px;
  font-size: 5em;
}
.button {
  margin-top: 50px;
}
</style>
