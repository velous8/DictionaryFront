<script setup>
import { ref, onMounted } from 'vue'
import Word from '../components/Word.vue'
import {loadProgress} from '../utils/progressStorage'
import {getAllWords} from '../utils/api'

const wordList = ref(null);

onMounted(async () => {
    wordList.value = await getAllWords();
    wordList.value = await loadProgress(wordList.value);
}); 
</script>

<template>
        <form class="filter" id="search">
            <input name="query" v-model="searchQuery" placeholder="Поиск">
            <select>
                <option value="1">A-Z</option>
                <option value="2">А-Я</option>
                <option value="3">%</option>
            </select>
        </form>
    <div class="word-list">
        <Word
            v-for="(item, index) in wordList"
            :todo="item"
            :key="index"
            :class="{ odd: index % 2 !== 0 }"
        />
    </div>
</template>

<style scoped>
.odd>*{
    background-color: #a8dadc;
}
.filter{
    margin-left: 100px;
}
.filter>*{
    margin: 1em;
}
</style>
