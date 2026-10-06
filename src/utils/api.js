// ============================================================
//  БАЗОВЫЙ URL
// ============================================================
const BASE_URL = "http://localhost:3000";
const API_URL = `${BASE_URL}/auth`;

// ============================================================
//  УПРАВЛЕНИЕ ТОКЕНОМ
// ============================================================
let accessToken = localStorage.getItem("accessToken") || null;

// Внешний колбэк, который вызовет app при разлогинивании
// (чтобы не тащить сюда vue-router)
let onUnauthorized = () => {};

export const setOnUnauthorized = (cb) => {
  onUnauthorized = cb;
};

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
};

export const getAccessToken = () => accessToken;

// ============================================================
//  БАЗОВЫЙ ЗАПРОС
// ============================================================
const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    ...options,
  });
  return response;
};

// ============================================================
//  ЗАПРОС С АВТОРИЗАЦИЕЙ + АВТО-REFRESH
// ============================================================
let refreshPromise = null; // защита от параллельных refresh

const refreshTokens = async () => {
  // Если refresh уже идёт — ждём тот же промис, не долбим бэк
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        credentials: "include", // refreshToken в httpOnly cookie
      });
      if (!response.ok) throw new Error("refresh failed");
      const data = await response.json();
      setAccessToken(data.accessToken);
      return data;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const fetchWithAuth = async (url, options = {}) => {
  const buildOptions = () => ({
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  let response = await request(url, buildOptions());

  // Access token протух — пробуем обновить и повторить ОДИН раз
  if (response.status === 401) {
    try {
      await refreshTokens();
      response = await request(url, buildOptions());
    } catch {
      // refresh не удался → разлогиниваем
      setAccessToken(null);
      onUnauthorized();
      throw Object.assign(new Error("Unauthorized"), { status: 401 });
    }
  }

  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response;
};

// ============================================================
//  AUTH
// ============================================================
export const register = async (email, password) => {
  const response = await request(`${API_URL}/register`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = new Error("Register failed");
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  setAccessToken(data.accessToken);
  return data;
};

export const login = async (email, password) => {
  const response = await request(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = new Error("Login failed");
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  setAccessToken(data.accessToken);
  return data;
};

export const logout = async () => {
  await request(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  setAccessToken(null);
};

export const refresh = refreshTokens;

// ============================================================
//  WORDS (защищённые)
// ============================================================

export const getIdsUnknownWords = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/word/idsUnknown`);
  return response.json();
};

export const getIdsWordsData = async (ids) => {
  const response = await fetchWithAuth(`${BASE_URL}/word/unknown?ids=${ids}`);

  return response.json();
};

export const getKnownWord = async (amount) => {
  const response = await fetchWithAuth(`${BASE_URL}/word/known?amountWords=${amount}`);
  return response.json();
};

export const getWordsProgress = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/word/progress`);
  return response.json();
};

export const updateWordsProgress = async (ids, values) => {
  const response = await fetchWithAuth(`${BASE_URL}/word/progress`, {
    method: "PATCH",
    body: JSON.stringify({ ids, values }),
  });
  return response.json();
};

export const getAllWords = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/word`);
  return response.json();
};

export const getUnknownWord = async (ids, amount) => {
  const response = await fetchWithAuth(`${BASE_URL}/word/unknown/${amount}`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  return response.json();
};

export const getAmountWord = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/word/amount`);
  return response.json();
};

// ============================================================
//  ADMIN WORDS (защищённые, требуют роль admin на бэке)
// ============================================================
export const createWord = async (createWordDto) => {
  console.log(createWordDto);
  const response = await fetchWithAuth(`${BASE_URL}/admin/word`, {
    method: "POST",
    body: JSON.stringify(createWordDto),
  });
  return response.json();
};

export const updateWord = async (id, updateWordDto) => {
  const response = await fetchWithAuth(`${BASE_URL}/admin/word/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updateWordDto),
  });
  return response.json();
};

export const deleteWord = async (id) => {
  await fetchWithAuth(`${BASE_URL}/admin/word/${id}`, {
    method: "DELETE",
  });
};
