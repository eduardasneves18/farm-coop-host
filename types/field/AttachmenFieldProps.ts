import React from 'react';

export interface AttachmentFieldProps {
  urlUpload: string;
  onChange: (event:React.ChangeEvent<HTMLInputElement>) => void;
}
