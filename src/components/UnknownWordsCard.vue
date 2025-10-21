<script setup>
//  --ИМПОРТЫ--
import { ref, onMounted, computed } from 'vue'
import {getProgress, saveProgress} from '../utils/progressStorage'
import {getAllWords} from '../utils/api'

const emit = defineEmits(['save-words'])

//  --СОСТОЯНИЯ--
const knownWordsIds = ref([])
const unknownWords = ref([])
const bufWords = ref([])

const dataWord = ref({})

const MAX_AMOUNT_UNKNOWN_WORD = 5
const MAX_AMOUNT_KNOWN_WORD = 3
const counterWord = ref(0)

const dataWordList = ref([])
const isActive = ref(false)


//  --ЖИЗНЕННЫЕ ЦИКЛЫ--
onMounted(async () => {
    await fetchWords();
    await nextWord();
}); 

//  --МЕТОДЫ--
const getCompletedWordIds = () => {
    return getProgress().filter(item => item.progress === 100).map(item => item.id);
}

const excludedIds = () => {
    return [...getCompletedWordIds(), ...unknownWords.value];
}

const fetchWords = async () => {
    const response = await fetch(`http://localhost:3000/word/unknown/${MAX_AMOUNT_UNKNOWN_WORD}`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids: excludedIds()
        })
    });
    
    bufWords.value = await response.json();
    if(bufWords.value.length == 0) {
        emit('save-words', [...unknownWords.value, ...getCompletedWordIds()])
        return 0;
    }
    console.log(bufWords.value);
}

const saveWord = (id, progress) => {
    const saved = getProgress();
    saved.push({id, progress});
    saveProgress(saved);
}

const nextWord = async () => {
    if (counterWord.value >= bufWords.value.length) {
        
        await fetchWords();
        
        counterWord.value = 0;
    }
    
    dataWord.value = bufWords.value[counterWord.value]
}

const know = async () => {
    saveWord(
        bufWords.value[counterWord.value]._id,
        100
    ); 
    counterWord.value++;
    await nextWord();
}

const unknown = async () => {   
    unknownWords.value.push(bufWords.value[counterWord.value]._id)
    if (unknownWords.value.length >= 3) {
       emit('save-words', [...unknownWords.value, ...getCompletedWordIds()])
    }
    counterWord.value++;
    await nextWord();
}
</script>

<template>
    <div class="train-card">
        <div class="score">Слов 0 из 10</div>
        <div class = "eng">{{ dataWord.eng }}</div>
        <div class = "translat" :class="{noActive: !isActive}">
            <div class = "transcription">|{{ dataWord.transcription }}|</div>
            <div class = "translation">{{ dataWord.translation }}</div>
        </div>
        <button class="show" @click="toggleTranslat">Показать перевод</button>
        <div class="answer" >
            <button class="dont-know" @click="unknown">Я не знал</button>
            <button class="know" @click="know">Знал</button>
        </div>
    </div>
</template>

<style scoped>
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
.noActive{
    Visibility:hidden;
}

</style>
