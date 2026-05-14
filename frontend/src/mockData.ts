import { Hippodrome, Owner, Jockey, Horse, Race, Participation, AppUser } from './types';

export const mockHippodromes: Hippodrome[] = [
  { id: 'h1', name: 'Королевский Аскот', city: 'Аскот', address: 'Ascot SL5 7JX, UK' },
  { id: 'h2', name: 'Ипподром Мейдан', city: 'Дубай', address: 'Al Meydan Rd, Dubai, UAE' },
  { id: 'h3', name: 'Черчилль-Даунс', city: 'Луисвилл', address: '700 Central Ave, KY, USA' },
];

export const mockOwners: Owner[] = [
  { id: 'o1', full_name: 'Уильям Харрисон', phone_number: '+44 7700 900000', address: 'Лондон, Великобритания' },
  { id: 'o2', full_name: 'Сара Дженкинс', phone_number: '+1 502 555 0199', address: 'Луисвилл, Кентукки' },
];

export const mockJockeys: Jockey[] = [
  { id: 'j1', full_name: 'Фрэнки Деттори', age: 52, license: 'LIC-001' },
  { id: 'j2', full_name: 'Райан Мур', age: 40, license: 'LIC-002' },
  { id: 'j3', full_name: 'Ошин Мерфи', age: 28, license: 'LIC-003' },
];

export const mockHorses: Horse[] = [
  { id: 'horse1', nickname: 'Удар молнии', color: 'Гнедая', age: 4, owner_id: 'o1' },
  { id: 'horse2', nickname: 'Полуночное эхо', color: 'Вороная', age: 5, owner_id: 'o2' },
  { id: 'horse3', nickname: 'Золотой галоп', color: 'Рыжая', age: 3, owner_id: 'o1' },
  { id: 'horse4', nickname: 'Серебряная стрела', color: 'Серая', age: 6, owner_id: 'o2' },
];

export const mockRaces: Race[] = [
  { id: 'r1', name: 'Золотой кубок', hippodrome_id: 'h1', date: '2026-06-18', time: '15:40', prize: 500000, status: 'upcoming' },
  { id: 'r2', name: 'Мировой кубок Дубая', hippodrome_id: 'h2', date: '2026-03-27', time: '20:45', prize: 12000000, status: 'upcoming' },
  { id: 'r3', name: 'Кентукки Дерби', hippodrome_id: 'h3', date: '2026-05-02', time: '18:50', prize: 3000000, status: 'ongoing' },
  { id: 'r4', name: 'Осенний спринт', hippodrome_id: 'h1', date: '2025-09-15', time: '14:00', prize: 50000, status: 'finished' },
];

export const mockParticipations: Participation[] = [
  { id: 'p1', race_id: 'r1', horse_id: 'horse1', jockey_id: 'j1' },
  { id: 'p2', race_id: 'r1', horse_id: 'horse2', jockey_id: 'j2' },
  { id: 'p3', race_id: 'r3', horse_id: 'horse3', jockey_id: 'j3', place: 1 },
  { id: 'p4', race_id: 'r4', horse_id: 'horse4', jockey_id: 'j1', place: 2 },
];

export const mockUsers: AppUser[] = [
  { email: 'admin@stallion.com', password: 'admin', role: 'admin', name: 'Администратор' },
  { email: 'jockey@stallion.com', password: 'jockey', role: 'jockey', name: 'Фрэнки Деттори' },
];
