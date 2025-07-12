import { Header, TextField } from 'generic-components-web';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-green-700">🌿 Coop Farm Host</h1>
          <p className="text-gray-600 mb-6">
            Bem-vinda! Selecione uma funcionalidade para começar:
          </p>
          <div className="flex flex-col gap-4">
            <TextField 
              id={''} 
              className={''} 
              label={'teste'} 
              placeholder={''} 
              onChange={function (event: React.ChangeEvent<any>): void {
                throw new Error('Function not implemented.');
              } }
            />
            <Link href="/formulario-generico" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
              🧩 Formulário Genérico
            </Link>
            <Link href="/testes/componentes" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              🧪 Teste de Componentes
            </Link>
            <Link href="/form-configurator" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
              ⚙️ Configurador de Formulário
            </Link>
          </div>
        </div>
      </div></>
  );
}
