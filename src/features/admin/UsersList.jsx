import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {getUsers} from "../../api/userService.jsx";
import {getAdminStats} from "../../api/dashboardService.js";

const UsersList = () => {
    const [users, setUsers] = useState([]);

    const [role, setRole] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const users = await getUsers(role === 'Todos' ? null : role, searchQuery)
            setLoading(false);
            setUsers(users)
        }
        fetchUsers();

    }, [role, searchQuery])

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
                {/* Título */}
                <h2 className="text-4xl font-bold text-blue-800 mb-6">Lista de Usuarios</h2>

                {/* Filtros y búsqueda */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <label className="text-gray-700 font-semibold mr-2">Filtro:</label>
                        <select
                            className="p-2 rounded border"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Todos">Todos</option>
                            <option value="normal">Usuario</option>
                            <option value="professional">Profesional</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o correo..."
                            className="pl-10 pr-4 py-2 rounded-md w-64 border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg
                            className="w-4 h-4 absolute left-3 top-3 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th className="text-left py-3 text-gray-600">Nombre</th>
                            <th className="text-left py-3 text-gray-600">Correo</th>
                            <th className="text-left py-3 text-gray-600">Profesión</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="py-10 text-center">
                                    <div className="flex justify-center items-center">
                                        <div
                                            className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length !== 0 ? (
                            <>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-300">
                                        <td className="py-3 flex items-center">
                                            <img
                                                src={`/avatars/${user.gender || 'default'}.png`}
                                                alt={user.name}
                                                className="h-8 w-8 rounded-full mr-2"
                                            />
                                            {user.name}
                                        </td>
                                        <td className="py-3">{user.email}</td>
                                        <td className="py-3">{user.role}</td>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <tr>
                                <td className="py-3 text-center text-gray-500" colSpan="3">
                                    No usuarios encontrados.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersList;