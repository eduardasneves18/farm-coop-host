import { TextField } from '../components/coop-farm-components';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-green-700">🌿 Coop Farm</h1>
          <p className="text-gray-600 mb-6">
            Bem-vindo(a) a sua cooperativa!
          </p>
          <div className="flex flex-col gap-4">
          
          </div>
        </div>
      </div></>
  );
}
