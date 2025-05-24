import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, ShieldCheck, Save } from 'lucide-react';
import { registerUser } from '../../api/dashboardService';

const UserRegister = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    sendEmail: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      alert(response.message || t('userRegister.success'));
      setFormData({
        name: '',
        email: '',
        role: '',
        password: '',
        sendEmail: true,
      });
    } catch (error) {
      console.error(error);
      alert(t('userRegister.error'));
    }
  };

  return (
    <div className='bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6 py-20 relative z-10'>
        <h2 className='text-4xl font-bold text-blue-800 mb-6 text-center'>
          {t('userRegister.title')}
        </h2>

        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto space-y-4'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className=' text-gray-700 mb-1 flex items-center gap-2'>
                <User className='w-4 h-4' />
                {t('userRegister.name')}
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                className='w-full p-2 rounded border'
                placeholder={t('userRegister.namePlaceholder')}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className='text-gray-700 mb-1 flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                {t('userRegister.email')}
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                className='w-full p-2 rounded border'
                placeholder={t('userRegister.emailPlaceholder')}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className=' text-gray-700 mb-1 flex items-center gap-2'>
              <Lock className='w-4 h-4' />
              {t('userRegister.password')}
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              className='w-full p-2 rounded border'
              placeholder={t('userRegister.passwordPlaceholder')}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className=' text-gray-700 mb-1 flex items-center gap-2'>
              <ShieldCheck className='w-4 h-4' />
              {t('userRegister.role')}
            </label>
            <select
              name='role'
              value={formData.role}
              className='w-full p-2 rounded border'
              onChange={handleChange}
              required
            >
              <option value=''>{t('userRegister.rolePlaceholder')}</option>
              <option value='admin'>{t('user.roles.admin')}</option>
              <option value='patient'>{t('user.roles.patient')}</option>
              <option value='professional'>
                {t('user.roles.professional')}
              </option>
            </select>
          </div>

          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2'
          >
            <Save className='w-4 h-4' />
            {t('buttons.register')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
