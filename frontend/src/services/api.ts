import { Horse, User, Owner, Race, Hippodrome, Participation } from '../types';

const API_BASE = 'http://localhost:5000/api';

function coerceIdsToString<T>(obj: any): T {
  if (obj === null || obj === undefined) return obj as T;
  if (Array.isArray(obj)) {
    return obj.map(item => coerceIdsToString(item)) as any;
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (key === 'id' || key.endsWith('_id')) {
          newObj[key] = val !== null && val !== undefined ? String(val) : val;
        } else if (typeof val === 'object') {
          newObj[key] = coerceIdsToString(val);
        } else {
          newObj[key] = val;
        }
      }
    }
    return newObj as T;
  }
  return obj as T;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('accessToken');

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  return coerceIdsToString<T>(data);
}

export const api = {
  login: async (credentials: { login: string; password: string }) => {
    const res = await request<{ accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await request<void>('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // Logout failed silently — clear tokens anyway
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');
    const res = await request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.accessToken;
  },

  // ─── HORSES ─────────────────────────────────────────────────────────────────
  getHorses: () => request<Horse[]>('/horses'),
  getHorseById: (id: string | number) => request<Horse>(`/horses/${id}`),
  createHorse: (data: Omit<Horse, 'id'>) => request<Horse>('/horses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHorse: (id: string | number, data: Partial<Horse>) => request<Horse>(`/horses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHorse: (id: string | number) => request<void>(`/horses/${id}`, {
    method: 'DELETE',
  }),

  // ─── USERS ────────────────────────────────────────────────────────────────
  getUsers: () => request<User[]>('/users'),
  getUserById: (id: string | number) => request<User>(`/users/${id}`),
  createUser: (data: Omit<User, 'id'>) => request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateUser: (id: string | number, data: Partial<User>) => request<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteUser: (id: string | number) => request<void>(`/users/${id}`, {
    method: 'DELETE',
  }),

  // ─── OWNERS ─────────────────────────────────────────────────────────────────
  getOwners: () => request<Owner[]>('/owners'),
  getOwnerById: (id: string | number) => request<Owner>(`/owners/${id}`),
  createOwner: (data: Omit<Owner, 'id'>) => request<Owner>('/owners', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateOwner: (id: string | number, data: Partial<Owner>) => request<Owner>(`/owners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteOwner: (id: string | number) => request<void>(`/owners/${id}`, {
    method: 'DELETE',
  }),
  getOwnerHorses: (id: string | number) => request<Horse[]>(`/owners/${id}/horses`),

  // ─── HIPPODROMES ────────────────────────────────────────────────────────────
  getHippodromes: () => request<Hippodrome[]>('/hippodromes'),
  getHippodromeById: (id: string | number) => request<Hippodrome>(`/hippodromes/${id}`),
  createHippodrome: (data: Omit<Hippodrome, 'id'>) => request<Hippodrome>('/hippodromes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHippodrome: (id: string | number, data: Partial<Hippodrome>) => request<Hippodrome>(`/hippodromes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHippodrome: (id: string | number) => request<void>(`/hippodromes/${id}`, {
    method: 'DELETE',
  }),

  // ─── RACES ──────────────────────────────────────────────────────────────────
  getRaces: () => request<Race[]>('/races'),
  getRaceById: (id: string | number) => request<Race>(`/races/${id}`),
  createRace: (data: Omit<Race, 'id' | 'status'>) => request<Race>('/races', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRace: (id: string | number, data: Partial<Race>) => request<Race>(`/races/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteRace: (id: string | number) => request<void>(`/races/${id}`, {
    method: 'DELETE',
  }),
  getRaceResults: (id: string | number) => request<Participation[]>(`/races/${id}/results`),
  addRaceResult: (id: string | number, data: { horse_id: string | number; jockey_id: string | number; place?: number }) => request<Participation>(`/races/${id}/results`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // ─── PARTICIPATIONS ─────────────────────────────────────────────────────────
  getParticipations: () => request<Participation[]>('/participations'),
  createParticipation: (data: Omit<Participation, 'id'>) => request<Participation>('/participations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateParticipation: (id: string | number, data: { place: number | null }) => request<Participation>(`/participations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteParticipation: (id: string | number) => request<void>(`/participations/${id}`, {
    method: 'DELETE',
  }),
};
