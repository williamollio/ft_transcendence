export interface User {
  id: number;
  name: string;
}

export interface Friends {
  id: number;
}
export interface UserCreation {
  name: string;
  friends: Friends[] | undefined;
}
