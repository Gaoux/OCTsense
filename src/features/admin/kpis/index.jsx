import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../../components/u-i/Navbar/AdminNavbar'; // Solo AdminNavbar

const AdminKPIs = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await axios.get('/api/admin/kpis/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegúrate de incluir el token de autenticación
          },
        });
        setKpis(response.data);
      } catch (err) {
        setError('Error al cargar los KPIs');
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) return <p>Cargando KPIs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Barra de navegación exclusiva para administradores */}
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">KPIs Administrativos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Usuarios registrados en los últimos 30 días */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm">Usuarios registrados en los últimos 30 días</p>
            <p className="text-3xl font-bold text-blue-800">{kpis?.users_last_30_days ?? 0}</p>
          </div>

          {/* Usuarios activos en el último mes */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm">Usuarios activos en el último mes</p>
            <p className="text-3xl font-bold text-blue-800">{kpis?.active_users_last_month ?? 0}</p>
          </div>

          {/* Promedio de inicios de sesión por usuario */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm">Promedio de inicios de sesión por usuario</p>
            <p className="text-3xl font-bold text-blue-800">{(kpis?.average_logins_per_user ?? 0).toFixed(2)}</p>
          </div>

          {/* Total de errores reportados */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm">Total de errores reportados</p>
            <p className="text-3xl font-bold text-blue-800">{kpis?.total_errors_reported ?? 0}</p>
          </div>

          {/* Errores no resueltos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-600 text-sm">Errores no resueltos</p>
            <p className="text-3xl font-bold text-blue-800">{kpis?.unresolved_errors ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminKPIs;