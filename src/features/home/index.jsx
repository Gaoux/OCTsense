import React from "react";
import { motion } from "framer-motion";
import { FaUpload, FaMicroscope, FaFileAlt ,FaLock} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import redFondo from "../../assets/fondo-red.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen pt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {}
        <section className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-10 mb-28 z-20">
          {}
          <div>
            <h1 className="text-4xl font-bold text-blue-800 mb-4">
              Optimiza tus imágenes OCT con{" "}
              <span className="text-blue-900">OCTsense</span>
            </h1>
            <p className="text-gray-800 max-w-xl text-lg">
              Un sistema avanzado de detección en imágenes OCT basado en inteligencia artificial.
              Nuestro objetivo es facilitar la detección temprana de patologías oculares,
              proporcionando herramientas para un diagnóstico más preciso y eficiente.
            </p>
          </div>

          {/* Imagen  */}
          <div className="flex justify-center md:justify-end relative">
            <img
              src={redFondo}
              alt="Vector tecnológico"
              className="w-[220%] max-w-xl md:absolute md:bottom-[-330px] md:right-[-50px] opacity-90 pointer-events-none select-none"
            />
          </div>
        </section>

        {/* Beneficios + Guía interactiva */}
        <div className="grid md:grid-cols-2 gap-6 mb-10 relative z-30">
          {/* Beneficios */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              ¿Por qué usar OCTsense?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
              <li>Diagnóstico más rápido con inteligencia artificial</li>
              <li>Reducción de errores en el diagnóstico gracias al análisis asistido por IA</li>
              <li>Compatibilidad con múltiples formatos de imagen</li>
              <li className="flex items-center gap-2"><FaLock className="text-blue-600" /> Acceso seguro</li>

            </ul>
            <div className="mt-6">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
                onClick={() => navigate("/upload")}
              >
                Pruébalo
              </button>
            </div>
          </div>

          {/* Guía interactiva */}
          <div className="bg-blue-100 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-6">Guía interactiva</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-xl shadow text-center transition-all"
              >
                <FaUpload className="text-blue-600 text-3xl mx-auto mb-2" />
                <h3 className="text-red-500 font-semibold">Carga</h3>
                <p className="text-gray-600 text-sm">
                  Gestión de imágenes de manera rápida y segura.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-xl shadow text-center transition-all"
              >
                <FaMicroscope className="text-blue-600 text-3xl mx-auto mb-2" />
                <h3 className="text-red-500 font-semibold">Análisis</h3>
                <p className="text-gray-600 text-sm">
                  Asistido por IA para obtener prediagnósticos confiables.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-xl shadow text-center transition-all"
              >
                <FaFileAlt className="text-blue-600 text-3xl mx-auto mb-2" />
                <h3 className="text-red-500 font-semibold">Informe</h3>
                <p className="text-gray-600 text-sm">
                  Resultados detallados del análisis.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
