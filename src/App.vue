<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import './assets/styles/main.css';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Responsive Layout */
@media (max-width: 768px) {
  .app {
    padding: 0;
  }
}
</style> 