import React from 'react';
import { LookupProps } from '../../types/field/LookupProps';

const LookupField: React.FC<LookupProps> = ({
  id,
  value,
  className = '',
  label,
  options,
  placeholder,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: selected === '__placeholder__' ? '' : selected,
      },
    };

    onChange(newEvent as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className={`fields ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id}  className="select" value={value || '__placeholder__'} onChange={handleChange}>
        <option  className="options" value="__placeholder__" disabled hidden>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LookupField;
