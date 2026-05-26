import React, { useState } from 'react';
import { FormLayout } from '../ui/FormLayout';
import { InputField } from '../ui/InputField';
import { Owner } from '../../types';

interface HorseFormProps {
  onClose: () => void;
  owners: Owner[];
  onSubmit: (data: any) => Promise<void>;
}

export function HorseForm({ onClose, owners, onSubmit }: HorseFormProps) {
  const [nickname, setNickname] = useState('');
  const [color, setColor] = useState('');
  const [age, setAge] = useState('');
  const [ownerId, setOwnerId] = useState(owners[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      nickname,
      color,
      age: Number(age),
      owner_id: ownerId
    });
    onClose();
  };

  return (
    <FormLayout title="Новая лошадь" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="Кличка лошади" placeholder="Напр. Вихрь" value={nickname} onChange={e => setNickname(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Окрас" placeholder="Гнедая" value={color} onChange={e => setColor(e.target.value)} />
          <InputField label="Возраст" type="number" placeholder="4" value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Владелец</label>
          <select
            required
            value={ownerId}
            onChange={e => setOwnerId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
          >
            {owners.map(o => <option key={o.id} value={o.id}>{o.full_name}</option>)}
          </select>
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Зарегистрировать
        </button>
      </form>
    </FormLayout>
  );
}
