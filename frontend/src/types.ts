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

export interface Jockey {
  id: string;
  full_name: string;
  age: number;
  license: string;
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
  jockey_id: string;
  place?: number | null;
}

export type UserRole = 'guest' | 'jockey' | 'admin';

export interface AppUser {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}
