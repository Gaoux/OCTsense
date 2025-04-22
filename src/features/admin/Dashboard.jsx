import {Link} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {getAdminStats} from "../../api/dashboardService.js";
/*import React, { useEffect, useState } from 'react';
import axios from '../../api/apiClient'; // Asegúrate de que apiClient esté configurado correctamente

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/users/admin/dashboard-stats/');
        setStats(response.data); // Asume que el backend devuelve un objeto con las estadísticas
      } catch (err) {
        console.error('Error al obtener estadísticas del Dashboard:', err);
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
*/

const Dashboard = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);


    // Datos de estadísticas quemados
    // const stats = {
    //   totalUsers: 13,
    //   totalPatients: 8,
    //   totalOphthalmologists: 3,
    //   totalAdmins: 2,
    // };

    // Usuarios recientes quemados
    const recentUsers = [
        {id: '1', name: 'Juan Mendez', profession: 'Profesional', email: 'JuanM@gmail.com'},
        {id: '2', name: 'Laura Mojica', profession: 'Profesional', email: 'LauM@gmail.com'},
        {id: '3', name: 'Carlos Pérez', profession: 'Profesional', email: 'CarlosP@gmail.com'},
    ];

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const stats = await getAdminStats()
            setStats(stats)
            setLoading(false);
        }
        fetchStats();

    }, [])

    return (
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden">
            {/* Navbar */}
            <header
                className="py-2 bg-very-dark-secondary dark:bg-very-dark-secondary fixed top-0 left-0 right-0 z-50 p-4 shadow-md flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/microscope-icon.png" alt="OCTsense" className="h-8 mr-2"/>
                    <h1 className="text-white text-2xl font-bold">OCTsense</h1>
                </div>
                <nav className="flex space-x-4">
                    <Link to="/" className="text-white hover:underline">Inicio</Link>
                    <Link to="/usuarios" className="text-white hover:underline">Usuarios</Link>
                    <Link to="/registrar" className="text-white hover:underline">Registrar</Link>
                    <Link to="/editar" className="text-white hover:underline">Editar</Link>
                    <Link to="/profile" className="text-white hover:underline">Perfil</Link>
                </nav>
            </header>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Título del Dashboard */}
                <h2 className="text-4xl font-bold text-blue-800 mb-6">Dashboard</h2>

                {/* Tarjetas de estadísticas */}
                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Usuarios</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_users ?? (
                                <div className="flex items-center justify-center">
                                    <div
                                        className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Pacientes</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_patients ?? (
                                <div className="flex items-center justify-center">
                                    <div
                                        className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Profesionales</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_ophthalmologists ?? (
                                <div className="flex items-center justify-center">
                                    <div
                                        className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Administradores</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_admins ?? (
                                <div className="flex items-center justify-center">
                                    <div
                                        className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Usuarios recientes */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-blue-700 mb-4">Usuarios Recientes</h3>
                    <ul className="space-y-4">
                        {recentUsers.map((user) => (
                            <li
                                key={user.id}
                                className="flex justify-between items-center bg-blue-50 p-4 rounded-lg shadow-sm"
                            >
                                <div>
                                    <p className="text-blue-800 font-semibold">{user.name}</p>
                                    <p className="text-gray-600 text-sm">{user.profession}</p>
                                </div>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;