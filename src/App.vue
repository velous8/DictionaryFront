<script setup>
import Header from './components/Header.vue'
import WordList from './pages/WordList.vue'
import Train from './pages/Train.vue';
import Progress from './pages/Progress.vue';
</script>

<template>
    <Header></Header>
    <router-view />
    <!-- <Progress/> -->
    <!-- <WordList/> -->
    <!-- <Train/> -->
</template>

<style scoped>

</style>
