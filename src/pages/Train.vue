<script setup>
//  --ИМПОРТЫ--
import { ref, onMounted, watch, onUnmounted} from 'vue'
import TrainWords from '@/components/TrainWordsCard.vue'
import UnknownWords from '@/components/UnknownWordsCard.vue'
import Word from '@/components/Word.vue'
import {loadProgress, getProgress, saveProgress, addProgress} from '../utils/progressStorage'
import {getKnownWord} from '../utils/api'

//  --СОСТОЯНИЯ--
const hasVisitedBefore = ref(false)
const startTrain = ref(false)
const wordList = ref([])

//  --ЖИЗНЕННЫЕ ЦИКЛЫ--
onMounted(() => {loadWords()})

//  --МЕТОДЫ--

const loadWords = async () => {
    const saved = localStorage.getItem('lernWord');
    if (saved) {
        wordList.value = JSON.parse(saved);
        wordList.value = await loadProgress(wordList.value);
        hasVisitedBefore.value = false;
    } else {
        hasVisitedBefore.value = true;
    }
}

const cancel = () => {
    localStorage.removeItem('lernWord')
    hasVisitedBefore.value = true
    startTrain.value = false
}

const start = () => {
    hasVisitedBefore.value = false
    startTrain.value = true
}

const handleSaveWords = async (words) => {
    wordList.value = await getKnownWord(words)
    localStorage.setItem('lernWord', JSON.stringify(wordList.value));
    hasVisitedBefore.value = false;
    wordList.value = await loadProgress(wordList.value);
}

const handleSaveProgress = (WordIds) => {
    addProgress(WordIds)
    localStorage.removeItem('lernWord')
    hasVisitedBefore.value = true
    startTrain.value = false
}

</script>

<template>
    <UnknownWords v-if = " hasVisitedBefore" @save-words="handleSaveWords"/>
    <div class="trining" v-if = "!hasVisitedBefore">
        <div class="wordList" v-if = "!startTrain">
                <div class="word-list">
        <Word
            v-for="(item, index) in wordList"
            :todo="item"
            :key="index"
        />
    </div>
            <div class="continueCancel">
                <button class=" button" @click="cancel">Отмена</button>
                <button class="start primary-button" @click="start">Продолжить</button>
            </div>
        </div>
        <TrainWords v-if = "startTrain"  @save-progress="handleSaveProgress"/> 
    </div>
    
</template>

<style scoped>
.odd>*{
    background-color: #a8dadc;
}
.train-card{
    margin-left: auto;
    margin-right: auto;
    max-width: 30em;
    text-align: center;
    background-color: hsl(var(--card));
    border-radius: 0.5rem;
    border: 1px solid hsl(var(--border));
}
.score{
    padding: 1em;
    font-size: 1em;
}
.eng{
    padding: 1.5em 0 0.5em;
    font-size: 2em;
    font-weight: bold;
}
.translat{
    
    padding: 1em;
}
.translat>*{
    padding: 0.1em;
}
.translation{
    font-weight: bold;
    font-size: 1.3em;
}
.answer>*{
    margin: 1em;
}

.noVisibil{
    Visibility:hidden;
}
.continueCancel{
    text-align: center;
}
.continueCancel>*{
    margin: 1rem;
    width: 10rem;
}

.word-list {
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
}

.word-list > * + * {
  border-top: 1px solid hsl(var(--border));
}
</style>
