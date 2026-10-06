<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { isAuthenticated, logout } = useAuth();

const handleLogout = async () => {
  await logout();
  router.push("/login");
};
</script>

<template>
  <div class="nav-panel">
    <nav class="navigation">
      <router-link :to="{ name: 'words' }" :class="{ bold: $route.name === 'words' }">
        <img src="../assets/wordsLogo.svg" />Слова
      </router-link>
      <router-link :to="{ name: 'train' }" :class="{ bold: $route.name === 'train' }">
        <img src="../assets/studyLogo.svg" />Тренировка
      </router-link>
      <router-link :to="{ name: 'progress' }" :class="{ bold: $route.name === 'progress' }">
        <img src="../assets/progressLogo.svg" />Прогресс
      </router-link>

      <!-- Разделитель -->
      <div class="divider"></div>

      <!-- Авторизован -->
      <template v-if="isAuthenticated">
        <button class="auth-link logout" type="button" @click="handleLogout">Выйти</button>
      </template>

      <!-- Не авторизован -->
      <template v-else>
        <router-link
          :to="{ name: 'login' }"
          :class="['auth-link', 'login', { bold: $route.name === 'login' }]"
        >
          Войти
        </router-link>
        <router-link
          :to="{ name: 'register' }"
          :class="['auth-link', 'register', { bold: $route.name === 'register' }]"
        >
          Регистрация
        </router-link>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
}
.navigation > * {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 14px;
  line-height: 1.43;
}
.bold {
  background-color: #f5f5f5;
}
.navigation > *:hover {
  background-color: #f5f5f5;
}

/* --- Разделитель --- */
.divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 0.5rem 0.75rem;
  padding: 0;
}
.divider:hover {
  background-color: #e5e5e5; /* чтобы не подсвечивался как ссылка */
}

/* --- Кнопки авторизации --- */
.auth-link {
  cursor: pointer;
  font-weight: 500;
  border: none;
  background: transparent;
  font-family: inherit;
  text-align: left;
}

.auth-link .icon {
  display: inline-block;
  width: 1em;
  text-align: center;
  font-size: 1.1em;
  line-height: 1;
}

/* Синий — логин и регистрация */
.login,
.register {
  color: #2563eb;
}
.login:hover,
.register:hover {
  background-color: #eff6ff;
  color: #1d4ed8;
}

/* Красный — logout */
.logout {
  color: #dc2626;
}
.logout:hover {
  background-color: #fef2f2;
  color: #b91c1c;
}

/* Перебиваем общий .bold для цветных ссылок,
   чтобы активная страница логина/регистрации не теряла цвет */
.login.bold,
.register.bold {
  background-color: #eff6ff;
  color: #1d4ed8;
}

@media (max-width: 768px) {
  .nav-panel {
    display: none;
  }
}
</style>
