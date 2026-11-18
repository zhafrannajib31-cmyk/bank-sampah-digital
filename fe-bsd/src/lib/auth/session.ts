import { SESSION_COOKIE, isRole, type Role } from "./guard";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
}

export interface AuthSession {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

const ACCESS_KEY = "bsd.accessToken";
const REFRESH_KEY = "bsd.refreshToken";
const USER_KEY = "bsd.user";

const storage = () => (typeof window === "undefined" ? null : window.localStorage);

/** Cookie hanya membawa role untuk gating route di proxy; token asli ada di localStorage. */
// shortcut: token di localStorage (bukan cookie HttpOnly) karena be-bsd mengembalikan token di body;
// ganti ke cookie HttpOnly bila be-bsd menyediakan sesi cookie.
function writeRoleCookie(role: Role | null): void {
  document.cookie =
    role === null
      ? `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`
      : `${SESSION_COOKIE}=${role}; path=/; max-age=28800; samesite=lax`;
}

export function saveSession(session: AuthSession): void {
  const store = storage();
  if (!store) return;
  store.setItem(ACCESS_KEY, session.accessToken);
  store.setItem(REFRESH_KEY, session.refreshToken);
  store.setItem(USER_KEY, JSON.stringify(session.user));
  writeRoleCookie(session.user.role);
}

export function updateTokens(accessToken: string, refreshToken: string): void {
  const store = storage();
  if (!store) return;
  store.setItem(ACCESS_KEY, accessToken);
  store.setItem(REFRESH_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return storage()?.getItem(ACCESS_KEY) ?? null;
}

export function getRefreshToken(): string | null {
  return storage()?.getItem(REFRESH_KEY) ?? null;
}

export function getSessionUser(): SessionUser | null {
  const raw = storage()?.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as SessionUser;
    return isRole(user.role) ? user : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  const store = storage();
  store?.removeItem(ACCESS_KEY);
  store?.removeItem(REFRESH_KEY);
  store?.removeItem(USER_KEY);
  if (typeof document !== "undefined") writeRoleCookie(null);
}
