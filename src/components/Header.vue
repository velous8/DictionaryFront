<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<template>
  <header class="header">
    <nav class="navigation">
      <router-link :to="{ name: 'words' }"  :class="{'bold': $route.name === 'words'}">Слова</router-link>
      <router-link :to="{ name: 'train' }" :class="{'bold': $route.name === 'train'}">Тренировка</router-link>
      <router-link :to="{ name: 'progress' }" :class="{'bold': $route.name === 'progress'}">Прогресс</router-link>
      
    </nav>
  </header>
</template>

<style scoped>
.header{
  background-color: #1d3557;
}
.navigation{
  display: flex;
  justify-content: center;
}
.navigation>*{
  color:#a8dadc;
  
  text-decoration: none;
  margin: 1em 2em;
  min-width: 200px;
  text-align: center
}
.bold{
  color:#f1faee;
  font-weight: bold;
  font-size: 1.1em;
}
</style>
