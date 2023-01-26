export interface Friends {
  id: number;
}
export interface UserCreation {
  name: string;
  friends?: Friends[];
}

export interface User {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  filename?: string;
  friends?: User[];
}
