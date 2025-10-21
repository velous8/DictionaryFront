<script setup>
import { ref } from 'vue'

const countWord = ref(null)
const totalWord = ref(null)
const wordProcent = ref(null)

fetch('http://localhost:3000/word/stat')

    .then(response => response.json())
    .then(data => {countWord.value = data
      totalWord.value = data.learned+data.startLearned+data.remaining
        wordProcent.value = { learned: data.learned/totalWord.value*100, 
        startLearned: data.startLearned/totalWord.value*100, 
        remaining: data.remaining/totalWord.value*100}
    })  
</script>

<template>
  <div class="progress">    
    <div class="canvas">
      <svg class="chart" width="500" height="500" viewBox="0 0 50 50">
        <circle class="unit" r="15.9" cx="50%" cy="50%"></circle>
        <circle class="unit" r="15.9" cx="50%" cy="50%"></circle>
        <circle class="unit" r="15.9" cx="50%" cy="50%"></circle>
      </svg>
    </div>
    <div class="stats"> 
      <div class="word-cunt">Всего слов: {{ totalWord }}</div>
      <div class="learned"><div class="color-stats"></div>Заучено полностью: {{countWord.learned}} ({{wordProcent.learned}}%) </div>
      <div class="start-learned"><div class="color-stats"></div>Пройденные слова: {{countWord.startLearned}} ({{wordProcent.startLearned}}%)</div>     
      <div class="remaining"><div class="color-stats"></div>Оставшиеся слова: {{countWord.remaining}} ({{wordProcent.remaining}}%)</div>
    </div> 
  </div>
</template>

<style scoped>
.progress{
  display: flex;
  justify-content: center;
  align-items: center;
}
.stats>*{
  display: flex;
  align-items: center;
  gap:0.5em;
  padding-top: 2em;
}
.color-stats{
  width: 10px;
  height: 10px;
}
.start-learned>.color-stats{
  background-color: #a8dadc;
}
.learned>.color-stats{
  background-color: #457b9d;
}
.remaining>.color-stats{
  background-color: #e63946;
}



.canvas {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
}
.unit {
  fill: none;
  stroke-width: 10;
}

.unit:nth-child(1) {
  stroke: #457b9d;
  stroke-dasharray: v-bind('wordProcent.learned') 100;
}

.unit:nth-child(2) {
  stroke: #a8dadc;
  stroke-dasharray: v-bind('wordProcent.startLearned') 100;
  stroke-dashoffset: v-bind('-wordProcent.learned');
}

.unit:nth-child(3) {
  stroke: #e63946;
  stroke-dasharray: v-bind('wordProcent.remaining') 100;
  stroke-dashoffset: v-bind('-wordProcent.startLearned-wordProcent.learned');
}

</style>
