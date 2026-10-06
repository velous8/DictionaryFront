<script setup>
import { ref, onMounted, computed } from "vue";
import Word from "../components/Word.vue";
import { getAllWords, getWordsProgress } from "../utils/api";

import castmSelect from "@/components/castmSelect.vue";

const wordList = ref(null);
const selectedFilter = ref("Все");
const selectedSort = ref("A-Z");

onMounted(async () => {
  const [words, progress] = await Promise.all([getAllWords(), getWordsProgress()]);

  const progressMap = new Map(progress.map((p) => [p.wordId, p.progress]));

  wordList.value = words.map((word) => ({
    ...word,
    progress: progressMap.get(word.id) ?? 0,
  }));
});

const filteredWords = computed(() => {
  if (!wordList.value) return [];

  let filtered = [...wordList.value];

  switch (selectedFilter.value) {
    case "Незнакомые":
      filtered = filtered.filter((item) => item.progress === 0);
      break;
    case "Изучаемые":
      filtered = filtered.filter((item) => item.progress > 0 && item.progress < 100);
      break;
    case "Выученные":
      filtered = filtered.filter((item) => item.progress === 100);
      break;
  }

  switch (selectedSort.value) {
    case "A-Z":
      filtered.sort((a, b) => (a > b ? -1 : 1));
      break;
    case "Z-A":
      filtered.sort((a, b) => (a > b ? 1 : -1));
      break;
  }

  return filtered;
});
</script>

<template>
  <div class="direction">
    <div class="filter">
      <form class="filter-selecter" id="search">
        <castmSelect
          v-model="selectedFilter"
          :options="['Все', 'Незнакомые', 'Изучаемые', 'Выученные']"
        ></castmSelect>

        <castmSelect v-model="selectedSort" :options="['A-Z', 'Z-A']"></castmSelect>
      </form>

      <div class="count-words">{{ filteredWords.length }} слов</div>
    </div>
    <div class="word-list">
      <Word v-for="(item, index) in filteredWords" :todo="item" :key="index" />
    </div>
  </div>
</template>

<style scoped>
.direction {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-selecter {
  display: flex;
  gap: 0.5rem;
}
@media (max-width: 640px) {
  .filter {
    gap: 0.5rem;
    flex-direction: column;
    align-items: stretch;
  }
}

.count-words {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
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
