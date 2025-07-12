// components/GenericForm.tsx
import React from 'react';
import { FormField } from '../models/FormField';
import { InputField, SelectField } from 'generic-components-web'; 
type Props = {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
};

const GenericForm: React.FC<Props> = ({ fields, onSubmit }) => {
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
      {fields.map((field) => {
        const colSpan = field.colSpan ?? 6;

        return (
          <div key={field.name} className={`col-span-${colSpan}`}>
            {field.type === 'text' || field.type === 'number' ? (
              <InputField
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                required={field.required}
                value={formValues[field.name] || ''}
                onChange={(e: any) => handleChange(field.name, e.target.value)}
              />
            ) : field.type === 'select' && field.options ? (
              <SelectField
                label={field.label}
                options={field.options.map(opt => ({ label: opt, value: opt }))}
                value={formValues[field.name] || ''}
                onChange={(value: string) => handleChange(field.name, value)}
              />
            ) : null}
          </div>
        );
      })}
      <div className="col-span-12">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Salvar
        </button>
      </div>
    </form>
  );
};

export default GenericForm;
