import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaUser, FaKey, FaSave, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, validateEmail, logout, updateUser } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('settings.errors.name_required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('settings.errors.email_required');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('settings.errors.email_invalid');
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('settings.errors.passwords_mismatch');
    }

    if (formData.newPassword && !formData.currentPassword) {
      newErrors.currentPassword = t('settings.errors.current_password_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateUser(formData);
      setSuccessMessage(t('settings.success.update_success'));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className='bg-very-dark-secondary px-6 py-6'>
          <div className='flex items-center justify-center gap-3'>
            <div className='bg-white p-2 rounded-full shadow-md'>
              <FaUser className='h-6 w-6 text-very-dark-secondary' />
            </div>
            <h1 className='text-2xl md:text-3xl font-bold text-white'>
              {t('settings.title')}
            </h1>
          </div>
        </div>

        <p className='mt-8 ml-6 flex text-dark-primary text-lg'>
          {t('settings.subtitle')}
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 text-dark-secondary py-8 space-y-6">
          {errors.submit && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              {successMessage}
            </div>
          )}

          {/* Sección Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-dark-secondary flex items-center gap-2">
              <FaUser className="text-dark-secondary" />
              {t('settings.personal_info')}
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-primary mb-1">
                {t('settings.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full text-dark-primary px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-primary mb-1">
                {t('settings.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 text-dark-primary rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          {/* Sección Cambio de Contraseña */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text--very-dark-secondary flex items-center gap-2">
              <FaKey className="text-dark-secondary" />
              {t('settings.change_password')}
            </h3>
            <p className="text-sm text-primary">
              {t('settings.password_instructions')}
            </p>

            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-dark-primary mb-1">
                {t('settings.current_password')}
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-dark-primary mb-1">
                {t('settings.new_password')}
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-primary mb-1">
                {t('settings.confirm_password')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaSignOutAlt />
              {t('settings.logout')}
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-dark-secondary hover:bg-accent-hover text-white rounded-lg transition-all duration-300 
              shadow-md hover:shadow-lg transform hover:scale-105 items-center'"
            >
              <FaSave />
              {t('settings.save_changes')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;