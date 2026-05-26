import React, { useState } from 'react';
import { FormLayout } from '../ui/FormLayout';
import { Race, Horse } from '../../types';

interface RegisterEntryFormProps {
  race: Race;
  horses: Horse[];
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function RegisterEntryForm({ race, horses, onClose, onSubmit }: RegisterEntryFormProps) {
  const [horseId, setHorseId] = useState(horses[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      horse_id: horseId,
    });
    onClose();
  };

  return (
    <FormLayout title={`Участие в: ${race.name}`} onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Выберите лошадь</label>
          <select
            required
            value={horseId}
            onChange={e => setHorseId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
          >
            {horses.map(h => <option key={h.id} value={h.id}>{h.nickname} ({h.color})</option>)}
          </select>
        </div>
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Вы регистрируетесь как элитный жокей. Убедитесь, что ваша лицензия действительна на дату проведения скачки ({race.date}).
          </p>
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Подтвердить участие
        </button>
      </form>
    </FormLayout>
  );
}
