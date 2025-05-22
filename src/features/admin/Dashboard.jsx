import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { getAdminStats, getRecentUsers } from "../../api/dashboardService.js"; // Importa el servicio

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Obtén estadísticas del dashboard
                const statsData = await getAdminStats();
                setStats(statsData);

                // Obtén usuarios recientes
                const usersData = await getRecentUsers();
                setRecentUsers(usersData);

            } catch (err) {
                console.error('Error al cargar datos del Dashboard:', err);
                setError('No se pudieron cargar los datos del Dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500 font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden">
            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Título del Dashboard */}
                <h2 className="text-4xl font-bold text-blue-800 mb-6">Dashboard</h2>

                {/* Tarjetas de estadísticas */}
                <div className="grid md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Usuarios</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_users ?? 0}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Pacientes</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_patients ?? 0}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Profesionales</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_ophthalmologists ?? 0}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <p className="text-gray-600 text-sm">Total Administradores</p>
                        <div className="text-3xl font-bold text-blue-800">
                            {stats?.total_admins ?? 0}
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
                                    <p className="text-gray-600 text-sm">{user.email}</p>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {new Date(user.date_joined).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;