<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<template>
  <header class="header">
    <div class="logo">
      <div class="logo-text">
        LexiDrill
      </div>
    </div>
  </header>
</template>

<style scoped>
.header{
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid hsl(var(--border));
  background-color: hsl(var(--background)/.8);

  backdrop-filter: blur(10px);
}

.logo{
  margin: 0 auto;
  margin-left: 0.5rem;
  max-width: 72rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
}
</style>
