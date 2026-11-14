import { readJson, removeKey, writeJson } from "@/lib/storage";
import { delay } from "@/services/delay";
import type {
  AuthCredentials,
  RegisterInput,
  User,
  UserRecord,
} from "@/types/user";

const USERS_KEY = "wherecipe.users";
const SESSION_KEY = "wherecipe.session";

function toPublicUser(record: UserRecord): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
  };
}

function listUsers(): UserRecord[] {
  return readJson<UserRecord[]>(USERS_KEY, []);
}

function saveUsers(users: UserRecord[]) {
  writeJson(USERS_KEY, users);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getCurrentUser(): Promise<User | null> {
  await delay(150);
  const userId = readJson<string | null>(SESSION_KEY, null);
  if (!userId) return null;

  const user = listUsers().find((item) => item.id === userId);
  return user ? toPublicUser(user) : null;
}

export async function registerUser(input: RegisterInput): Promise<User> {
  await delay(350);

  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!name || !email || password.length < 4) {
    throw new Error("Preencha nome, e-mail e uma senha com pelo menos 4 caracteres.");
  }

  const users = listUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error("Já existe uma conta com este e-mail.");
  }

  const record: UserRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  };

  saveUsers([...users, record]);
  writeJson(SESSION_KEY, record.id);
  return toPublicUser(record);
}

export async function loginUser(credentials: AuthCredentials): Promise<User> {
  await delay(350);

  const email = normalizeEmail(credentials.email);
  const user = listUsers().find(
    (item) => item.email === email && item.password === credentials.password,
  );

  if (!user) {
    throw new Error("E-mail ou senha incorretos.");
  }

  writeJson(SESSION_KEY, user.id);
  return toPublicUser(user);
}

export async function logoutUser(): Promise<void> {
  await delay(100);
  removeKey(SESSION_KEY);
}
