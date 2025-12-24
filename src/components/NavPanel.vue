<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<template>
  <div class="nav-panel">
    <nav class="navigation">
      <router-link :to="{ name: 'words' }"  :class="{'bold': $route.name === 'words'}"> <img src="../assets/wordsLogo.svg">Слова</router-link>
      <router-link :to="{ name: 'train' }" :class="{'bold': $route.name === 'train'}"><img src="../assets/studyLogo.svg">Тренировка</router-link>
      <router-link :to="{ name: 'progress' }" :class="{'bold': $route.name === 'progress'}"><img src="../assets/progressLogo.svg">Прогресс</router-link>     
    </nav>
</div>
</template>

<style scoped>

.navigation{
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
}
.navigation>*{
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 14px;
  line-height: 1.43;

 
}
.bold{
  background-color: #f5f5f5;
}
.navigation>*:hover {
  background-color: #f5f5f5;
}

 @media (max-width: 768px) {
  .nav-panel {
    display: none;
  }
}
</style>
