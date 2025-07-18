import React from 'react';
// import './Field.css';
 
import { FieldProps } from "../../types/field/FieldProps";

const DateField: React.FC<FieldProps> = ({ id, className, label, placeholder, onChange }) => (
  <div className={`fields ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input type="date" id={id} name="data" className="input" placeholder={placeholder} onChange={onChange} />
  </div>
);

export default DateField;
