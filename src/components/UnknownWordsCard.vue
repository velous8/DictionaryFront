<script setup>
//  --ИМПОРТЫ--
import { ref, onMounted, computed } from 'vue'
import {getProgress, saveProgress, getIncompleteProgressIds, getProgressIds, writeNewProgress} from '../utils/progressStorage'
import {getUnknownWord} from '../utils/api'
import WordsCard from './WordsCard.vue'

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

const fetchWords = async () => {
    bufWords.value = await getUnknownWord([...getProgressIds(), ...unknownWords.value], MAX_AMOUNT_UNKNOWN_WORD);
    if(bufWords.value.length == 0) {
        emit('save-words', [...unknownWords.value, ...getIncompleteProgressIds(7-unknownWords.value.length)])
        return 0;
    }
}

const nextWord = async () => {
    if (counterWord.value >= bufWords.value.length) {
        await fetchWords();
        counterWord.value = 0;
    }   
    dataWord.value = bufWords.value[counterWord.value]
    isActive.value = false; 
}

const know = async () => {
    writeNewProgress(bufWords.value[counterWord.value]._id, 100); 
    counterWord.value++;
    await nextWord();
}

const unknown = async () => {   
    unknownWords.value.push(bufWords.value[counterWord.value]._id)
    if (unknownWords.value.length >= 3) {
       emit('save-words', [...unknownWords.value, ...getIncompleteProgressIds(4)])
    }
    counterWord.value++;
    await nextWord();
}
</script>

<template>
    <div class="train-card">
               <WordsCard
        :word="dataWord"
        :is-active="isActive"
        @toggle="isActive=!isActive"
        @know="know"
        @unknown="unknown"
        ></WordsCard>
    </div>
</template>

<style scoped>


.train-card>*{
 padding: 1.5rem;
}
</style>
