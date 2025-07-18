import React from 'react';
import { FieldProps } from "../../types/field/FieldProps";
// import './Field.css';

const TextField: React.FC<FieldProps> = ({ id, className, label, placeholder, value, onChange }) => (
  <div className={`fields ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input type="text" id={id} className="input" placeholder={placeholder} value={value} onChange={onChange} />
  </div>
);

export default TextField;