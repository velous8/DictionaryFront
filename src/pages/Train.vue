<script setup>
import { ref, computed } from "vue";
import WordsCard from "@/components/WordsCard.vue";
import Word from "@/components/Word.vue";
import TrainWords from "@/components/TrainWordsCard.vue";
import {
  getIdsUnknownWords,
  getIdsWordsData,
  getKnownWord,
  updateWordsProgress,
  getWordsProgress,
} from "../utils/api";

// ── Настройки ─────────────────────────────────────────────
const MIN_POOL = 5;
const BATCH_SIZE = 5;
const TOTAL_POOL = 8;

// ── Состояние ─────────────────────────────────────────────
const screen = ref("start"); // 'start' | 'quiz' | 'pool' | 'test'
const allUnknownIds = ref([]);
const quizePool = ref([]);
const progressPool = ref({ ids: [], values: [] });
const currentWords = ref([]);
const currentIndex = ref(0);
const isActive = ref(false);
const loading = ref(false);
const error = ref(null);
const showPoolCount = ref(false);
const showCongrats = ref(false);

const currentWord = computed(() => currentWords.value[currentIndex.value] ?? null);

const serverProgressMap = ref(new Map());

const loadProgressMap = async () => {
  try {
    const progress = await getWordsProgress();
    serverProgressMap.value = new Map(progress.map((p) => [p.wordId, p.progress]));
  } catch (e) {
    console.log("Не удалось загрузить прогресс:", e);
    serverProgressMap.value = new Map();
  }
};

// ── Хелперы ───────────────────────────────────────────────

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pickBatch = () => {
  const shuffled = shuffle(allUnknownIds.value);
  const picked = shuffled.slice(0, BATCH_SIZE);
  const pickedSet = new Set(picked);
  allUnknownIds.value = allUnknownIds.value.filter((id) => !pickedSet.has(id));
  return picked;
};

const loadBatch = async () => {
  const ids = pickBatch();
  if (ids.length === 0) {
    currentWords.value = [];
    return false;
  }
  currentWords.value = await getIdsWordsData(ids.join(","));
  currentIndex.value = 0;
  isActive.value = false;
  return currentWords.value.length > 0;
};

// ── Основной сценарий ─────────────────────────────────────

const start = async () => {
  quizePool.value = [];
  progressPool.value = { ids: [], values: [] };
  currentWords.value = [];
  currentIndex.value = 0;
  isActive.value = false;
  showPoolCount.value = false;

  try {
    const [ids] = await Promise.all([getIdsUnknownWords(), loadProgressMap()]);

    allUnknownIds.value = shuffle(ids);
    const ok = await loadBatch();
    if (ok) screen.value = "quiz";
    else await finishPool();
  } catch (e) {
    console.log(e);
  }
};

const know = () => {
  const word = currentWord.value;
  if (!word) return;

  progressPool.value.ids.push(word.id);
  progressPool.value.values.push(100);

  nextWord();
};

const unknown = async () => {
  const word = currentWord.value;
  if (!word) return;

  quizePool.value.push(word);
  showPoolCount.value = true;

  if (quizePool.value.length >= MIN_POOL) {
    await finishPool();
    return;
  }

  nextWord();
};

const nextWord = async () => {
  currentIndex.value++;
  isActive.value = false;

  if (currentIndex.value < currentWords.value.length) return;

  if (quizePool.value.length >= MIN_POOL) {
    await finishPool();
    return;
  }

  const ok = await loadBatch();
  if (!ok) await finishPool();
};

const finishPool = async () => {
  const need = TOTAL_POOL - quizePool.value.length;
  if (need > 0) {
    try {
      const known = await getKnownWord(need);
      quizePool.value.push(...known);
    } catch (e) {
      console.log("Не удалось добрать слова:", e);
    }
  }
  screen.value = "pool";
};

const poolWithProgress = computed(() => {
  return quizePool.value.map((word) => {
    // локальный прогресс текущей сессии (если слово уже отмечено)
    const localIdx = progressPool.value.ids.indexOf(word.id);
    const localProgress = localIdx !== -1 ? progressPool.value.values[localIdx] : undefined;

    return {
      ...word,
      progress: localProgress ?? serverProgressMap.value.get(word.id) ?? 0,
    };
  });
});

// ── Тестирование ──────────────────────────────────────────

// Кнопка под списком пула
const startTest = () => {
  if (quizePool.value.length === 0) return;

  // TrainWords читает localStorage['lernWord'] и поле `_id` — добавляем алиас
  const forTest = quizePool.value.map((w) => ({ ...w, _id: w.id }));
  localStorage.setItem("lernWord", JSON.stringify(forTest));

  screen.value = "test";
};

// TrainWords эмитит массив id слов, которые пользователь «знал»
const handleTestFinish = async (correctIds) => {
  correctIds.forEach((id) => {
    progressPool.value.ids.push(id);
    progressPool.value.values.push(10);
  });

  localStorage.removeItem("lernWord");
  await updateWordsProgress(progressPool.value.ids, progressPool.value.values);
  console.log("progressPool после теста:", JSON.parse(JSON.stringify(progressPool.value)));

  showCongrats.value = true;
};

// Закрыть модалку и вернуться на стартовый экран
const closeCongrats = () => {
  showCongrats.value = false;
  screen.value = "start";

  quizePool.value = [];
  progressPool.value = { ids: [], values: [] };
  allUnknownIds.value = [];
  currentWords.value = [];
  currentIndex.value = 0;
  isActive.value = false;
  showPoolCount.value = false;
};
</script>

<template>
  <div v-if="screen === 'start'" class="start-screen">
    <h1>Тренировка слов</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <button class="button primary-button" :disabled="loading" @click="start">
      {{ loading ? "Загрузка…" : "Начать тренировку" }}
    </button>
  </div>

  <div v-else-if="screen === 'quiz'" class="train-card">
    <div v-if="showPoolCount" class="pool-counter">{{ quizePool.length }} из {{ MIN_POOL }}</div>

    <WordsCard
      v-if="currentWord"
      :word="currentWord"
      :is-active="isActive"
      @toggle="isActive = !isActive"
      @know="know"
      @unknown="unknown"
    />
  </div>

  <div v-else-if="screen === 'pool'" class="pool">
    <h2>Пул для изучения</h2>

    <div v-if="quizePool.length === 0" class="empty">Незнакомых слов не набралось</div>

    <div v-else class="word-list">
      <Word v-for="(item, index) in poolWithProgress" :todo="item" :key="index" />
    </div>

    <div v-if="quizePool.length > 0" class="continueCancel">
      <button class="button primary-button" @click="startTest">Начать тестирование</button>
    </div>
  </div>

  <TrainWords v-else-if="screen === 'test'" @save-progress="handleTestFinish" />

  <!-- Поздравительное модальное окно -->
  <div v-if="showCongrats" class="modal-overlay">
    <div class="modal">
      <h2>🎉 Поздравляем!</h2>
      <p>Вы прошли тестирование слов из пула.</p>
      <button class="button primary-button" @click="closeCongrats">На главную</button>
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  text-align: center;
  padding: 3rem 1rem;
}
.error {
  color: #d33;
}
.empty {
  text-align: center;
  opacity: 0.7;
  padding: 2rem;
}

.train-card {
  max-width: 30em;
  margin: 0 auto;
}

.pool-counter {
  text-align: center;
  font-size: 0.9em;
  opacity: 0.75;
  margin-bottom: 0.5rem;
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

.continueCancel {
  margin-top: 1.5rem;
  text-align: center;
}
.continueCancel > * {
  width: 12rem;
}

/* ── Модальное окно ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 22em;
  width: 90%;
  text-align: center;
}
.modal h2 {
  margin: 0 0 0.75rem;
}
.modal p {
  margin: 0 0 1.5rem;
  opacity: 0.85;
}
</style>
