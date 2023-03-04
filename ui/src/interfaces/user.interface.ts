export interface UserIds {
  id: string;
  name: string;
}

export interface UserCreation {
  name: string;
}

export interface User {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  filename?: string;
}
