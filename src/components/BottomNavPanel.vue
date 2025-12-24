<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const scrollToTop = () => {
    window.scrollTo(0,0);
  }
</script>

<template>
  <div class="nav-panel">
    <nav class="navigation">
       <router-link :to="{ name: 'words' }"   :class="{'bold': $route.name === 'words'}" @click="scrollToTop"> <img src="../assets/wordsLogo.svg">Слова</router-link>
      <router-link :to="{ name: 'train' }" :class="{'bold': $route.name === 'train'}"  @click="scrollToTop"><img src="../assets/studyLogo.svg">Тренировка</router-link>
      <router-link  :to="{ name: 'progress' }" :class="{'bold': $route.name === 'progress'}"  @click="scrollToTop"><img src="../assets/progressLogo.svg">Прогресс</router-link>     
    </nav>
</div>
</template>

<style scoped>
.nav-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  border-top: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 0.5rem;
}

 @media (min-width: 768px) {
  .nav-panel {
    display: none;
  }
}


 .navigation {
  margin-left: auto;
  margin-right: auto;
  max-width: 28rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.navigation>* {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}


.bold{
  background-color: hsl(var(--secondary));
}
.navigation>*:hover {
  background-color: hsl(var(--secondary));
}
</style>
