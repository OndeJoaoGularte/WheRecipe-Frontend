export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
