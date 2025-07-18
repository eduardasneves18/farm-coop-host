import React from 'react';
// import './Field.css';
 
import { LookupProps } from "../../types/field/LookupProps";

const LookupField: React.FC<LookupProps> = ({ id, value, className, label, options, onChange }) => (
  <div className={`fields ${className}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={onChange}>
          {options.map((option, index) => (
              <option key={index} value={option} style={{ color: 'black' }}>
                  {option}
              </option>
          ))}
      </select>
  </div>
);

export default LookupField;