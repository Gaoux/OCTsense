import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Datos de estadísticas quemados
  const stats = {
    totalUsers: 21,
    totalOphthalmologists: 19,
    otherUsers: 3,
  };

  // Usuarios recientes quemados
  const recentUsers = [
    { id: '1', name: 'Juan Mendez', profession: 'Oftalmólogo', email: 'JuanM@gmail.com' },
    { id: '2', name: 'Laura Mojica', profession: 'Oftalmóloga', email: 'LauM@gmail.com' },
    { id: '3', name: 'Carlos Pérez', profession: 'Paciente', email: 'CarlosP@gmail.com' },
  ];

  return (
    <div className="min-h-screen bg-sky-400">
      {/* Header */}
      <header className="bg-sky-500 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <img src="/microscope-icon.png" alt="OCTsense" className="h-6 mr-2" />
          <h1 className="text-white text-xl font-semibold">OCTsense</h1>
        </div>
        <nav className="flex space-x-4">
          <Link to="/" className="text-white">Inicio</Link>
          <Link to="/usuarios" className="text-white">Usuarios</Link>
          <Link to="/registrar" className="text-white">Registrar</Link>
          <Link to="/usuarios" className="text-white">Editar</Link>
          <Link to="/profile" className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto p-4">
        {/* Título del Dashboard */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

        {/* Tarjetas de estadísticas */}
        <div className="bg-sky-200 rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center border-r border-sky-300">
            <p className="text-sm text-gray-600">Total Usuarios</p>
            <p className="text-4xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
          <div className="text-center border-r border-sky-300">
            <p className="text-sm text-gray-600">Total Oftalmólogos</p>
            <p className="text-4xl font-bold text-gray-800">{stats.totalOphthalmologists}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Otros Usuarios</p>
            <p className="text-4xl font-bold text-gray-800">{stats.otherUsers}</p>
          </div>
        </div>

        {/* Tabla de Usuarios Recientes */}
        <div className="bg-sky-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Últimos Usuarios</h3>
            <button className="bg-red-400 text-white px-3 py-1 rounded">Ver todos</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-sky-300">
                <th className="text-left pb-2">Nombre</th>
                <th className="text-left pb-2">Profesión</th>
                <th className="text-left pb-2">Correo</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-sky-300">
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.profession}</td>
                  <td className="py-3">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;