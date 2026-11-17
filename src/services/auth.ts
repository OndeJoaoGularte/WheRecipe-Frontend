import { ApiError, apiFetch, getAccessToken, setAccessToken } from "@/lib/api";
import type { AuthCredentials, RegisterInput, User } from "@/types/user";

type AuthPayload = {
  user: {
    id: string;
    name: string;
    fullName?: string | null;
    email: string;
  };
  token: string;
};

type ProfilePayload = {
  id: string;
  name: string;
  fullName?: string | null;
  email: string;
};

type Wrapped<T> = { data: T };

function toUser(payload: {
  id: string;
  name?: string;
  fullName?: string | null;
  email: string;
}): User {
  return {
    id: String(payload.id),
    name: payload.name || payload.fullName || "",
    email: payload.email,
  };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!getAccessToken()) return null;

  try {
    const response = await apiFetch<Wrapped<ProfilePayload>>("/account/profile");
    return toUser(response.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      setAccessToken(null);
    }
    return null;
  }
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!name || !email || password.length < 8) {
    throw new Error(
      "Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.",
    );
  }

  const response = await apiFetch<Wrapped<AuthPayload>>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  setAccessToken(response.data.token);
  return toUser(response.data.user);
}

export async function loginUser(credentials: AuthCredentials): Promise<User> {
  const response = await apiFetch<Wrapped<AuthPayload>>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    }),
  });

  setAccessToken(response.data.token);
  return toUser(response.data.user);
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch<{ message: string }>("/account/logout", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}
