import React, { useState } from 'react';
import { FormLayout } from '../ui/FormLayout';
import { InputField } from '../ui/InputField';

interface HippodromeFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function HippodromeForm({ onClose, onSubmit }: HippodromeFormProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      city,
      address
    });
    onClose();
  };

  return (
    <FormLayout title="Новый ипподром" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="Название" placeholder="Центральный ипподром" value={name} onChange={e => setName(e.target.value)} />
        <InputField label="Город" placeholder="Москва" value={city} onChange={e => setCity(e.target.value)} />
        <InputField label="Адрес" placeholder="ул. Беговая, 22" value={address} onChange={e => setAddress(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Создать
        </button>
      </form>
    </FormLayout>
  );
}
