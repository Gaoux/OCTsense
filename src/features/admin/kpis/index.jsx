import React, { useEffect, useState } from 'react';
import { getKPIs, getErrorLogs } from '../../../api/dashboardService'; // Importa el servicio para obtener logs

const AdminKPIs = () => {
  const [kpis, setKpis] = useState(null);
  const [errorLogs, setErrorLogs] = useState([]); // Estado para los logs de errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIsAndLogs = async () => {
      try {
        const [kpiData, logsData] = await Promise.all([
          getKPIs(), // Llama al servicio para obtener los KPIs
          getErrorLogs(), // Llama al servicio para obtener los logs de errores
        ]);
        setKpis(kpiData);
        setErrorLogs(logsData); // Guarda los logs en el estado
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('No se pudieron cargar los datos. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchKPIsAndLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-10 text-center">KPIs Administrativos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Usuarios registrados en los últimos 30 días */}
          <KPIBox
            title="Usuarios registrados en los últimos 30 días"
            value={kpis?.users_last_30_days ?? 0}
            color="bg-white"
          />

          {/* Usuarios activos en el último mes */}
          <KPIBox
            title="Usuarios activos en el último mes"
            value={kpis?.active_users_last_month ?? 0}
            color="bg-white"
          />

          {/* Promedio de inicios de sesión por usuario */}
          <KPIBox
            title="Promedio de inicios de sesión por usuario"
            value={kpis?.average_logins_per_user !== undefined ? kpis.average_logins_per_user.toFixed(2) : 0}
            color="bg-white"
          />
        </div>

        {/* Tabla de logs de errores */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Logs de Errores</h2>
          {errorLogs.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Mensaje</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {errorLogs.map((log, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="px-4 py-2">{log.date}</td>
                    <td className="px-4 py-2">{log.message}</td>
                    <td className="px-4 py-2">{log.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No se encontraron logs de errores.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const KPIBox = ({ title, value, color }) => (
  <div className={`rounded-2xl shadow-lg p-6 text-center ${color}`}>
    <p className="text-gray-600 text-sm mb-2">{title}</p>
    <p className="text-4xl font-bold text-blue-800">{value}</p>
  </div>
);

export default AdminKPIs;