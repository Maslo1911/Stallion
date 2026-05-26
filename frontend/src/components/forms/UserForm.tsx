import React, { useState } from 'react';
import { FormLayout } from '../ui/FormLayout';
import { InputField } from '../ui/InputField';

interface UserFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function UserForm({ onClose, onSubmit }: UserFormProps) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [license, setLicense] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      full_name: fullName,
      age: Number(age),
      license
    });
    onClose();
  };

  return (
    <FormLayout title="Новый жокей" onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField label="ФИО Жокея" placeholder="Иван Иванов" value={fullName} onChange={e => setFullName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Возраст" type="number" placeholder="25" value={age} onChange={e => setAge(e.target.value)} />
          <InputField label="Лицензия" placeholder="LIC-000" value={license} onChange={e => setLicense(e.target.value)} />
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-4">
          Добавить в систему
        </button>
      </form>
    </FormLayout>
  );
}
