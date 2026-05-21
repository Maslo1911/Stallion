export interface Hippodrome {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface Owner {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
}

export interface User {
  id: string;
  full_name: string;
  age: number;
  license: string;
  role_id: number;
  login: string;
}

export interface Horse {
  id: string;
  nickname: string;
  color: string;
  age: number;
  owner_id: string;
}

export interface Race {
  id: string;
  name: string;
  hippodrome_id: string;
  date: string;
  time: string;
  prize: number;
  status: 'upcoming' | 'ongoing' | 'finished';
}

export interface Participation {
  id: string;
  race_id: string;
  horse_id: string;
  user_id: string;
  place?: number | null;
}

export type UserRole = 'guest' | 'user' | 'admin';

export interface AppUser {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}
