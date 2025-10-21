<script setup>
//  --ИМПОРТЫ--
import { ref, onMounted } from 'vue'

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
    getDataWord()
}); 

//  --МЕТОДЫ--
const toggleTranslat = () => {
    isActive.value = !isActive.value;
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
