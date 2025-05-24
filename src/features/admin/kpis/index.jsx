import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getKPIs } from '../../../api/dashboardService';

const AdminKPIs = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiData = await getKPIs();
        setKpis(kpiData);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError(t('kpis.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300'>
        <p className='text-red-500 font-bold'>{error}</p>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen'>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <h1 className='text-4xl font-bold text-blue-800 mb-10 text-center'>
          {t('kpis.title')}
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <KPIBox
            title={t('kpis.usersLast30Days')}
            value={kpis?.users_last_30_days ?? 0}
            color='bg-white'
          />
          <KPIBox
            title={t('kpis.activeUsersLastMonth')}
            value={kpis?.active_users_last_month ?? 0}
            color='bg-white'
          />
          <KPIBox
            title={t('kpis.avgLoginsPerUser')}
            value={
              kpis?.average_logins_per_user !== undefined
                ? kpis.average_logins_per_user.toFixed(2)
                : 0
            }
            color='bg-white'
          />
        </div>
      </div>
    </div>
  );
};

const KPIBox = ({ title, value, color }) => (
  <div className={`rounded-2xl shadow-lg p-6 text-center ${color}`}>
    <p className='text-gray-600 text-sm mb-2'>{title}</p>
    <p className='text-4xl font-bold text-blue-800'>{value}</p>
  </div>
);

export default AdminKPIs;
