export interface FieldProps {
  id: string
  value?: string | number;
  className: string;
  label: string;
  placeholder: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}