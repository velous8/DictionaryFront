<script setup>
//  --ИМПОРТЫ--
import { ref, onMounted, watch, onUnmounted} from 'vue'
import TrainWords from '@/components/TrainWordsCard.vue'
import UnknownWords from '@/components/UnknownWordsCard.vue'
import Word from '@/components/Word.vue'

//  --СОСТОЯНИЯ--
const hasVisitedBefore = ref(false)
const startTrain = ref(false)
const wordList = ref([])

//  --ЖИЗНЕННЫЕ ЦИКЛЫ--
onMounted(() => {loadWords()})

//  --МЕТОДЫ--

const loadWords = () => {
    const saved = localStorage.getItem('lernWord');
    if (saved) {
        wordList.value = JSON.parse(saved);
        getProgress();
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

const loadProgress = () => {
    try {
        return JSON.parse(localStorage.getItem('progressWords')) || [];
    } catch (error) {
        return [];
    }
}

const getProgress = () => {
    wordList.value = wordList.value.map((item) => {
        const progressItem = loadProgress().find((progress) => {
            return progress.id === item._id
        })
        return {...item, progress:  progressItem ? progressItem.progress : 0}
    })   
}

const saveProgress = (words) => {
    return localStorage.setItem('progressWords', JSON.stringify(words))
}

const handleSaveWords = async (words) => {
    const response = await fetch(`http://localhost:3000/word/known`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids: words
        })
    });
    wordList.value = await response.json();

    localStorage.setItem('lernWord', JSON.stringify(wordList.value));
    hasVisitedBefore.value = false;

    getProgress();
}

const handleSaveProgress = (WordIds) => {
    const result = WordIds.map((item) => {
        const progressItem = loadProgress().find((progress) => {
            return progress.id === item
        })

        if(progressItem) {
            progressItem.progress += 10
            return progressItem
        } else {
            return {id:item, progress: 10}
        }
        
    })
    saveProgress(result)

    localStorage.removeItem('lernWord')
    hasVisitedBefore.value = true
    startTrain.value = false
}

</script>

<template>
    <UnknownWords v-if = " hasVisitedBefore" @save-words="handleSaveWords"/>
    <div class="trining" v-if = "!hasVisitedBefore">
        <div class="wordList" v-if = "!startTrain">
            <Word
                v-for="(item, index) in wordList"
                :todo="item"
                :key="index"
                :class="{ odd: index % 2 !== 0 }"
            />
            <div class="continueCancel">
                <button class="cancel" @click="cancel">Отмена</button>
                <button class="start" @click="start">Продолжить</button>
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
    width: 30em;
    text-align: center;
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
    margin: 1em;
}

</style>
