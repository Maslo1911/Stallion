import React, { useState } from 'react';
import { FormLayout } from '../ui/FormLayout';
import { InputField } from '../ui/InputField';
import { Hippodrome, Race } from '../../types';

interface RaceFormProps {
  onClose: () => void;
  hippodromes: Hippodrome[];
  initialData?: Race;
  onSubmit: (data: any) => Promise<void>;
}

export function RaceForm({ onClose, hippodromes, initialData, onSubmit }: RaceFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time ? initialData.time.substring(0, 5) : '');
  const [hippodromeId, setHippodromeId] = useState(initialData?.hippodrome_id || hippodromes[0]?.id || '');
  const [prize, setPrize] = useState(initialData?.prize ? String(initialData.prize) : '');
  const [status, setStatus] = useState<Race['status']>(initialData?.status || 'planned');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = {
      name,
      date,
      time: time.length === 5 ? `${time}:00` : time,
      hippodrome_id: hippodromeId,
      prize: Number(prize)
    };
    if (initialData) {
      data.status = status;
    }
    await onSubmit(data);
    onClose();
  };

  return (
    <FormLayout title={initialData ? "Редактировать скачку" : "Создать скачку"} onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="Название скачки" placeholder="Напр. Кубок Президента" value={name} onChange={e => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Дата" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <InputField label="Время" type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ипподром</label>
          <select
            required
            value={hippodromeId}
            onChange={e => setHippodromeId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
          >
            {hippodromes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </div>
        
        {initialData && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Статус скачки</label>
            <select
              required
              value={status}
              onChange={e => setStatus(e.target.value as Race['status'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
            >
              <option value="planned">Ожидается (planned)</option>
              <option value="ongoing">Идет (ongoing)</option>
              <option value="finished">Завершено (finished)</option>
            </select>
          </div>
        )}

        <InputField label="Приз ($)" type="number" placeholder="50000" value={prize} onChange={e => setPrize(e.target.value)} />
        
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          {initialData ? "Сохранить изменения" : "Сохранить скачку"}
        </button>
      </form>
    </FormLayout>
  );
}
