import React from 'react';
import { FieldProps } from "../../types/field/FieldProps";
// import './Field.css';


const NumberField: React.FC<FieldProps> = ({ id, className, value=0.00 ,label, placeholder, onChange }) => (
  <div className={`fields ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input type="number" id={id} name="valor" value={value} min="1.00" step="1.00" className="input" placeholder={placeholder} onChange={onChange} />
  </div>
);

export default NumberField;