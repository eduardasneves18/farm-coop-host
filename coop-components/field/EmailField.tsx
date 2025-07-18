import React from 'react';
// import './Field.css';

import { FieldProps } from "../../types/field/FieldProps";

const EmailField: React.FC<FieldProps> = ({ id, className, label, placeholder, value, onChange }) => (
  <div className={`fields ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input type="email" id={id} className="input" placeholder={placeholder} value={value} onChange={onChange} />
  </div>
);

export default EmailField;