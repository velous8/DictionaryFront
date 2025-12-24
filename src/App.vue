<script setup>
import Header from './components/Header.vue'
import NavPanel from './components/NavPanel.vue'
import BottomPanel from './components/BottomNavPanel.vue'


// import { onMounted } from 'vue';

// onMounted(() => {
// let openRequest = indexedDB.open("db", 2);

// // создаём хранилище объектов для books, если ешё не существует
// openRequest.onupgradeneeded = function() {
//   let db = openRequest.result;
//   if (!db.objectStoreNames.contains('books')) { // если хранилище "books" не существует
//     db.createObjectStore('books', {keyPath: 'id'}); // создаём хранилище
//   }
// }
// })


</script>

<template>
    <Header></Header>
    <BottomPanel></BottomPanel>
    <div class="grid-container">
        <NavPanel></NavPanel>

        <main class="main">
            <router-view />
        <!-- <Progress/> -->
        <!-- <WordList/> -->
        <!-- <Train/> -->
        </main>
        
    </div >
    
</template>

<style scoped>
.grid-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 72rem; /* 1152px */
  padding-left: 1rem; /* 16px */
  padding-right: 1rem; /* 16px */    

  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  padding-top: 16px;
  padding-bottom: 16px;
}
@media (max-width: 768px) {
    .grid-container{
        grid-template-columns: repeat(1, 1fr);
        padding-bottom: 10rem;
    }
}


</style>
