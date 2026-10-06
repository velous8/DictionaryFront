<script setup>
//  --ИМПОРТЫ--
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

//  --СОСТОЯНИЯ--
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

const router = useRouter();
const { login } = useAuth(); // ← берём login ИЗ composable, не из api

//  --ВЫЧИСЛЯЕМЫЕ--
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isPasswordValid = computed(() => password.value.length >= 6);
const canSubmit = computed(() => isEmailValid.value && isPasswordValid.value && !isLoading.value);

//  --МЕТОДЫ--
const handleLogin = async () => {
  errorMessage.value = "";
  if (!canSubmit.value) return;

  isLoading.value = true;
  try {
    await login(email.value, password.value); // applyAuth внутри обновит ref
    router.push("/");
  } catch (err) {
    const status = err?.status;
    if (status === 401) {
      errorMessage.value =
        "Неверный email или пароль, либо аккаунт не активирован. Проверьте почту.";
    } else if (status === 400) {
      errorMessage.value = "Некорректные данные. Проверьте введённые поля.";
    } else {
      errorMessage.value = "Не удалось войти. Попробуйте позже.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <form class="auth-card" @submit.prevent="handleLogin">
      <h1 class="title">Вход</h1>

      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          required
        />
        <span v-if="email && !isEmailValid" class="hint error"> Введите корректный email </span>
      </div>

      <div class="field">
        <label for="password">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Введите пароль"
          autocomplete="current-password"
          required
        />
        <span v-if="password && !isPasswordValid" class="hint error">
          Пароль должен содержать минимум 6 символов
        </span>
      </div>

      <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>

      <button class="button primary-button" type="submit" :disabled="!canSubmit">
        {{ isLoading ? "Вход..." : "Войти" }}
      </button>

      <p class="switch">
        Нет аккаунта?
        <RouterLink to="/register">Зарегистрироваться</RouterLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 26em;
  padding: 2em;
  text-align: center;
  background-color: hsl(var(--card));
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.6em;
  font-weight: bold;
  margin: 0 0 0.5em;
}

.field {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.35em;
}

.field label {
  font-weight: bold;
  font-size: 0.9em;
}

.field input {
  padding: 0.7em 0.9em;
  border-radius: 0.4rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  color: inherit;
  font-size: 1em;
  outline: none;
  transition: border-color 0.15s ease;
}

.field input:focus {
  border-color: hsl(var(--primary, 220 90% 56%));
}

.hint {
  font-size: 0.8em;
}

.message {
  margin: 0;
  padding: 0.6em;
  border-radius: 0.4rem;
  font-size: 0.9em;
}

.error {
  color: #b00020;
}
.message.error {
  background-color: rgba(176, 0, 32, 0.1);
}

.button {
  padding: 0.8em 1em;
  border-radius: 0.4rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  color: inherit;
  cursor: pointer;
  font-size: 1em;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease;
}

.button:hover:not(:disabled) {
  background-color: hsl(var(--border));
}

.primary-button {
  background-color: hsl(var(--primary, 220 90% 56%));
  color: #fff;
  border-color: transparent;
  font-weight: bold;
}

.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch {
  font-size: 0.9em;
  margin: 0.5em 0 0;
}

.switch a {
  color: hsl(var(--primary, 220 90% 56%));
  font-weight: bold;
  text-decoration: none;
}
</style>
