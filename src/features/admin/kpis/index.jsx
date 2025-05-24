import React, { useEffect, useState } from 'react';
import { getKPIs } from '../../../api/dashboardService';
import { getReportHistory } from '../../../api/reportService'; // Importa el servicio para obtener reportes
import { useNavigate } from 'react-router-dom'; // Importa useNavigate


const AdminKPIs = () => {
const navigate = useNavigate(); // Hook para la navegación
  const [kpis, setKpis] = useState(null);
  const [reports, setReports] = useState([]); // Estado para los reportes
  const [filteredReports, setFilteredReports] = useState([]); // Estado para los reportes filtrados
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el texto de búsqueda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const handleViewDetails = (reportId) => {
      navigate(`/report/${reportId}`); // Redirige a la página de detalles del reporte
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiData = await getKPIs(); // Llama al servicio de KPIs
        setKpis(kpiData);

        const reportData = await getReportHistory(); // Llama al servicio de reportes
        setReports(reportData);
        setFilteredReports(reportData); // Inicializa los reportes filtrados con todos los reportes
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError('No se pudieron cargar los datos. Intenta nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Maneja el cambio en el texto de búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filtra los reportes por ID
    const filtered = reports.filter((report) =>
      report.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredReports(filtered);
  };

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
      {/* Barra de navegación exclusiva para administradores */}
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

        {/* Barra de búsqueda */}
        <div className="mt-10">
          <input
            type="text"
            placeholder="Buscar por ID de reporte"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

{/* Lista de reportes de todos los usuarios */}
<div className="mt-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Reportes de Todos los Usuarios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => handleViewDetails(report.id)} // Maneja el clic en el reporte
                >
                  <p className="text-lg font-bold text-blue-800">ID: {report.id}</p> {/* Muestra el ID del reporte */}
                  <p className="text-gray-500 text-xs mt-2">
                    Creado el: {new Date(report.created_at).toLocaleDateString()} {/* Muestra la fecha de creación */}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No hay reportes disponibles.</p>
            )}
          </div>
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