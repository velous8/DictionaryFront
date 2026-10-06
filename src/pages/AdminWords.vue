<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllWords, createWord, updateWord, deleteWord } from "../utils/api";
import { useRouter } from "vue-router";
import { isAdmin } from "../utils/auth";

const wordList = ref(null);
const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref("");

const showForm = ref(false);
const editingId = ref(null);

const emptyForm = () => ({
  word: "",
  translation: "",
  transcription: "",
});

const form = ref(emptyForm());

const isEditing = computed(() => editingId.value !== null);

const loadWords = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    wordList.value = await getAllWords();
  } catch (e) {
    errorMessage.value = "Не удалось загрузить список слов";
  } finally {
    isLoading.value = false;
  }
};

const router = useRouter();

onMounted(() => {
  if (!isAdmin()) {
    router.replace({ name: "Home" });
    return;
  }
  loadWords();
});

const openCreate = () => {
  form.value = emptyForm();
  editingId.value = null;
  errorMessage.value = "";
  showForm.value = true;
};

const openEdit = (item) => {
  editingId.value = item.id;
  form.value = {
    eng: item.eng ?? "",
    translation: item.translation ?? "",
    transcription: item.transcription ?? "",
  };
  errorMessage.value = "";
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingId.value = null;
  form.value = emptyForm();
  errorMessage.value = "";
};

const submitForm = async () => {
  if (!form.value.eng.trim() || !form.value.translation.trim()) {
    errorMessage.value = "Заполните слово и перевод";
    return;
  }

  isSaving.value = true;
  errorMessage.value = "";
  try {
    const payload = {
      eng: form.value.eng.trim(),
      translation: form.value.translation.trim(),
      transcription: form.value.transcription.trim(),
    };

    if (isEditing.value) {
      await updateWord(editingId.value, payload);
    } else {
      await createWord(payload);
    }

    closeForm();
    await loadWords();
  } catch (e) {
    errorMessage.value = isEditing.value ? "Не удалось обновить слово" : "Не удалось создать слово";
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = async (item) => {
  if (!confirm(`Удалить слово «${item.word}»?`)) return;
  errorMessage.value = "";
  try {
    await deleteWord(item.id);
    await loadWords();
  } catch (e) {
    errorMessage.value = "Не удалось удалить слово";
  }
};
</script>

<template>
  <div class="direction">
    <div class="filter">
      <h2 class="title">Управление словами</h2>
      <button class="btn btn-primary" @click="openCreate">+ Добавить слово</button>
    </div>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <div v-if="isLoading" class="empty">Загрузка…</div>

    <div v-else-if="!wordList || wordList.length === 0" class="empty">Слов пока нет</div>

    <div v-else class="word-list">
      <div class="word-row head">
        <div class="col col-word">Слово</div>
        <div class="col col-trans">Перевод</div>
        <div class="col col-transcr">Транскрипция</div>
        <div class="col col-actions">Действия</div>
      </div>

      <div v-for="item in wordList" :key="item.id" class="word-row">
        <div class="col col-word">{{ item.eng }}</div>
        <div class="col col-trans">{{ item.translation }}</div>
        <div class="col col-transcr">{{ item.transcription || "—" }}</div>
        <div class="col col-actions">
          <button class="btn btn-ghost" @click="openEdit(item)">Изменить</button>
          <button class="btn btn-danger" @click="confirmDelete(item)">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Модалка формы -->
    <div v-if="showForm" class="overlay" @click.self="closeForm">
      <form class="modal" @submit.prevent="submitForm">
        <h3 class="modal-title">
          {{ isEditing ? "Редактировать слово" : "Новое слово" }}
        </h3>

        <label class="field">
          <span>Слово</span>
          <input v-model="form.eng" type="text" required />
        </label>

        <label class="field">
          <span>Перевод</span>
          <input v-model="form.translation" type="text" required />
        </label>

        <label class="field">
          <span>Транскрипция</span>
          <input v-model="form.transcription" type="text" />
        </label>

        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="closeForm">Отмена</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving">
            {{ isSaving ? "Сохранение…" : isEditing ? "Сохранить" : "Создать" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.direction {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.error {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: hsl(var(--destructive, 0 84% 60%));
  background-color: hsl(var(--destructive, 0 84% 60%) / 0.1);
}

.empty {
  padding: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  background-color: hsl(var(--card));
}

.word-list {
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  overflow: hidden;
}

.word-list > * + * {
  border-top: 1px solid hsl(var(--border));
}

.word-row {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 1fr 1fr;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1rem;
}

.word-row.head {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--muted-foreground));
  background-color: hsl(var(--muted) / 0.4);
}

.col {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.btn-ghost {
  background-color: transparent;
  border-color: hsl(var(--border));
  color: hsl(var(--foreground));
}

.btn-ghost:hover {
  background-color: hsl(var(--muted) / 0.6);
}

.btn-danger {
  background-color: transparent;
  border-color: hsl(var(--destructive, 0 84% 60%));
  color: hsl(var(--destructive, 0 84% 60%));
}

.btn-danger:hover {
  background-color: hsl(var(--destructive, 0 84% 60%) / 0.1);
}

/* Модалка */
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}

.modal-title {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.field input {
  padding: 0.5rem 0.65rem;
  font-size: 0.95rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  outline: none;
}

.field input:focus {
  border-color: hsl(var(--primary));
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .filter {
    flex-direction: column;
    align-items: stretch;
  }

  .word-row {
    grid-template-columns: 1fr 1fr;
    row-gap: 0.4rem;
  }

  .word-row.head {
    display: none;
  }

  .col-actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}
</style>
