import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, validateEmail } = useAuth();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'email',
      'name',
      'role',
      'password',
      'confirmPassword',
    ];
    const hasEmpty = requiredFields.some((field) => !form[field]);
    if (hasEmpty) {
      setError(t('register.errors.emptyFields'));
      return;
    }

    if (!form.role) {
      setError(t('register.errors.roleRequired'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t('register.errors.passwordMismatch'));
      return;
    }

    if (!validateEmail(form.email)) {
      setError(t('register.errors.invalidEmail'));
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError(t('register.errors.passwordRequirements'));
      return;
    }

    if (!acceptedTerms) {
      setError(t('terms.required'));
      return;
    }

    try {
      setLoading(true);
      await register(form);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
      setError(t('register.errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-150'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-4xl font-extrabold text-center text-secondary mb-2 tracking-wide'>
          {t('login.title').slice(0, 3)}
          <span className='text-primary'>{t('login.title').slice(3)}</span>
        </h2>
        <p className='text-center text-gray-500 text-sm'>
          {t('register.subtitle')}
        </p>
        {error && <p className='text-sm text-red-600'>{error}</p>}

        <form className='space-y-4' onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            placeholder={t('register.placeholders.fullName')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <input
            type='email'
            name='email'
            placeholder={t('register.placeholders.email')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <select
            name='role'
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring focus:ring-cyan-300'
          >
            <option value=''>{t('register.placeholders.selectRole')}</option>
            <option value='patient'>{t('register.role.patient')}</option>
            <option value='professional'>
              {t('register.role.professional')}
            </option>
          </select>
          <input
            type='password'
            name='password'
            placeholder={t('register.placeholders.password')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />
          <input
            type='password'
            name='confirmPassword'
            placeholder={t('register.placeholders.confirmPassword')}
            onChange={handleChange}
            className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-cyan-300'
          />

          <div className='flex items-start gap-2'>
            <input
              type='checkbox'
              id='terms-checkbox'
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className='mt-1'
            />
            <label htmlFor='terms-checkbox' className='text-sm'>
              {t('terms.checkboxLabel')}{' '}
              <span
                className='text-primary underline cursor-pointer'
                onClick={() => setShowTerms((v) => !v)}
                tabIndex={0}
                role='button'
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    setShowTerms((v) => !v);
                }}
              >
                {t('terms.link')}
              </span>
            </label>
          </div>

          {showTerms && (
            <div className='bg-gray-100 border rounded p-3 text-xs mb-2'>
              <h3 className='font-bold mb-1'>{t('terms.title')}</h3>
              <p>{t('terms.content')}</p>
            </div>
          )}

          <button
            type='submit'
            disabled={loading || !acceptedTerms}
            className={`w-full mt-4 px-4 py-2 text-white bg-secondary rounded-md transition ${
              loading || !acceptedTerms
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-dark-secondary'
            }`}
          >
            {loading ? (
              <div className='flex items-center justify-center gap-2'>
                <svg
                  className='animate-spin h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z'
                  ></path>
                </svg>
                {t('register.loading')}
              </div>
            ) : (
              t('register.button')
            )}
          </button>

          <hr className='my-4 border-t border-gray-300' />

          <p className='text-center text-sm'>
            {t('register.alreadyHaveAccount')}{' '}
            <Link
              to={ROUTES.LOGIN}
              className='text-primary underline hover:text-dark-primary'
            >
              {t('register.loginLink')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
