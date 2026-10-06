import { ref, computed } from "vue";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  refresh as apiRefresh,
  setOnUnauthorized,
  setAccessToken,
  getAccessToken,
} from "@/utils/api";

const accessToken = ref(getAccessToken());
const user = ref(JSON.parse(localStorage.getItem("user") || "null"));

// Колбэк для редиректа — зарегистрируем в main.js или App.vue
let redirectToLogin = () => {
  window.location.href = "/login";
};
export const setUnauthorizedHandler = (cb) => {
  redirectToLogin = cb;
};

// Регистрируем обработчик в api.js
setOnUnauthorized(() => {
  accessToken.value = null;
  user.value = null;
  localStorage.removeItem("user");
  redirectToLogin();
});

export function useAuth() {
  const isAuthenticated = computed(() => !!accessToken.value);

  const applyAuth = (data) => {
    setAccessToken(data.accessToken);
    accessToken.value = data.accessToken;
    if (data.user) {
      user.value = data.user;
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  const clearAuth = () => {
    setAccessToken(null);
    accessToken.value = null;
    user.value = null;
    localStorage.removeItem("user");
  };

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    applyAuth(data);
    return data;
  };

  const register = async (email, password) => {
    const data = await apiRegister(email, password);
    applyAuth(data);
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {}
    clearAuth();
  };

  // Вызвать один раз при старте приложения
  const init = async () => {
    try {
      const data = await apiRefresh();
      applyAuth(data);
    } catch {
      clearAuth();
    }
  };

  return { isAuthenticated, user, login, register, logout, init };
}
