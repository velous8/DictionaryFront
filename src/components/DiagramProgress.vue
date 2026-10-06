<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from "chart.js";
import { ref, reactive, onMounted } from "vue";

import { getWordsProgress, getAmountWord } from "../utils/api";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const chartData = reactive({
  labels: ["Выученные", "В изучении", "Неизвестные"],
  datasets: [
    {
      label: "Прогресс",
      data: [0, 0, 0],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      borderWidth: 2,
      borderColor: "#fff",
      cutout: "50%",
    },
  ],
});

const chartOptions = ref({
  plugins: {
    legend: { display: false },
  },
});

onMounted(async () => {
  await counterWords();
});

const counterWords = async () => {
  try {
    const [progress, totalWords] = await Promise.all([getWordsProgress(), getAmountWord()]);

    let learned = 0; // progress === 100
    let studying = 0; // 0 < progress < 100
    let unfamiliar = 0;

    progress.forEach((item) => {
      if (item.progress === 100) learned++;
      else if (item.progress > 0) studying++;
      else unfamiliar++;
    });

    // Слова, по которым вообще нет записи прогресса, — тоже неизвестные
    unfamiliar += totalWords - progress.length;

    chartData.datasets[0].data = [learned, studying, unfamiliar];
  } catch (e) {
    console.error("Не удалось загрузить прогресс:", e);
  }
};
</script>

<template>
  <div class="doughnut-chart-container">
    <Doughnut
      v-if="chartData.datasets[0].data.some((val) => val > 0)"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="no-data">Загрузка данных...</div>
  </div>
</template>

<style scoped>
.doughnut-chart-container {
  max-width: 300px;
  margin: 0 auto;
}
</style>
