'use client';

import React from 'react';
import { LookupField } from '../../components/coop-farm-components';

type Props = {
  id: string;
  label?: string;
  className?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
};


const unitOptions = [
  'kg (quilogramas)',
  'g (gramas)',
  'l (litros)',
  'ml (mililitros)',
  'dz (dezenas)',
  'un (unidade)',
];

const UnitLookupField: React.FC<Props> = ({
  id,
  label = 'Unidade de Medida',
  className = '',
  value = '',
  onChange,
  placeholder
}) => {

  return (
    <LookupField
      id={id}
      label={label}
      options={unitOptions}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
  );
};

export default UnitLookupField;
