<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from "./components/Header.vue";
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
main {
  padding: 1rem;
}
</style>
