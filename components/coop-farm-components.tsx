import dynamic from 'next/dynamic';

const TextField = dynamic(() => import('generic-components-web').then(mod => mod.TextField), { ssr: false });
const NumberField = dynamic(() => import('generic-components-web').then(mod => mod.NumberField),{ ssr: false });
const EmailField = dynamic(() => import('generic-components-web').then(mod => mod.EmailField), { ssr: false });
const PasswordField = dynamic(() => import('generic-components-web').then(mod => mod.PasswordField), { ssr: false });
const DateField = dynamic(() => import('generic-components-web').then(mod => mod.DateField),{ ssr: false });
const AttachmentField = dynamic(() => import('generic-components-web').then(mod => mod.AttachmentField),{ ssr: false });
const LookupField = dynamic(() => import('generic-components-web').then(mod => mod.LookupField),{ ssr: false });
const Header = dynamic(() =>import('generic-components-web').then(mod => mod.Header),{ ssr: false });

export {
  TextField,
  NumberField,
  EmailField,
  PasswordField,
  DateField,
  AttachmentField,
  Header,
  LookupField,
};
