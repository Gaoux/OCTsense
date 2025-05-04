import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      <h1 className="text-7xl font-extrabold text-red-600">404</h1>
      <p className="mt-4 text-xl font-semibold">¡Oops! Página no encontrada.</p>
      <p className="mt-2 text-gray-600">La ruta que estás buscando no existe o ha sido movida.</p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
