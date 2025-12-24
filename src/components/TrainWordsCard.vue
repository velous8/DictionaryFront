<script setup>
//  --ИМПОРТЫ--
import { ref, onMounted } from 'vue'
import WordsCard from './WordsCard.vue'

const emit = defineEmits(['save-progress'])

//  --СОСТОЯНИЯ--

const isActive = ref(false)
const dataWord = ref({})
const dataWordList = ref([])
const counterWord = ref(0)
const correctWordId = ref([])


//  --ЖИЗНЕННЫЕ ЦИКЛЫ--
onMounted(() => {
    dataWordList.value = JSON.parse(localStorage.getItem('lernWord'));
    dataWordList.value.sort(() => Math.random() - 0.5)
    getDataWord()
}); 

//  --МЕТОДЫ--
const getDataWord = () => {
    if (dataWordList.value.length === 0) {
        emit('save-progress', correctWordId.value)
        return
    }
    if (counterWord.value >= dataWordList.value.length) {
        counterWord.value = 0;
    }
    dataWord.value = dataWordList.value[counterWord.value];
    isActive.value = false;     
}

const know = () => {  
    correctWordId.value.push(dataWordList.value[counterWord.value]._id)
    dataWordList.value.splice(counterWord.value, 1)
    getDataWord()
}

const unknown = () => {         
    counterWord.value++;
    getDataWord()
}

</script>

<template>
    <div class="train-card">
        <div class="score">Слов 0 из 10</div>
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