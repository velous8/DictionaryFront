// Декодируем payload JWT (без проверки подписи — она на бэке)
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // base64url → base64 → JSON (кириллица через decodeURIComponent/escape)
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getRole = () => {
  const token = localStorage.getItem("accessToken");
  const payload = decodeToken(token);
  return payload?.role ?? null;
};

export const isAdmin = () => getRole() === "ADMIN";
