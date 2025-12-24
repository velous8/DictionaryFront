<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
import { ref, reactive, onMounted, watch } from 'vue'

import {getProgress} from '../utils/progressStorage'
import {getAmountWord} from '../utils/api'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const chartData = reactive({
  labels: ['Выученные', 'В изучении', 'Неизвестные'],
  datasets: [
    {
      label: 'Прогресс',
      data: [0, 0, 0], // Начальные нулевые значения
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56'
      ],
      borderWidth: 2,
      borderColor: '#fff',
      cutout: '50%'
    }
  ]
})

const chartOptions = ref({
  plugins: {
    legend: {
      display: false // Полностью отключаем легенду
    }
  }
})


onMounted(async () => {
  await counterWords()
})
const counterWords = async () => {
  const progress = getProgress()
  let learned = 0
  let studying = 0

  progress.forEach((item) => {
    if (item.progress === 100) {
      learned++
    } else {
      studying++
    }
  })

  const totalWords = await getAmountWord()
  const unfamiliar = totalWords - learned - studying
  
  chartData.datasets[0].data = [learned, studying, unfamiliar]
  
}

</script>

<template>
  <div class="doughnut-chart-container">
    <Doughnut v-if="chartData.datasets[0].data.some(val => val > 0)" :data="chartData" :options="chartOptions" />
    <div v-else class="no-data">Загрузка данных...</div>
  </div>
</template>

<style scoped>
.doughnut-chart-container {
  max-width: 300px;
  margin: 0 auto;
}
</style>