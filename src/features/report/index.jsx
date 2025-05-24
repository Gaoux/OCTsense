import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReportHistory, deleteReport } from '../../api/reportService';
import ReportCard from '../../components/ui/reportCard';
import ConfirmDeleteModal from '../../components/ui/confirmDeleteModal';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ClipboardPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';

const Report = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [diagnosticFilter, setDiagnosticFilter] = useState('');
  const [eyeFilter, setEyeFilter] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      getReportHistory()
        .then((data) => {
          console.log('Fetched reports:', data); // DEBUG
          if (Array.isArray(data)) {
            setReports(data);
          } else {
            console.error('Invalid reports format:', data);
            setReports([]); // fallback to avoid crash
          }
        })
        .catch((err) => {
          console.error('Failed to load reports:', err);
          setReports([]);
        });
    }
  }, [isAuthenticated]);

  const openDeleteModal = (reportId) => {
    setSelectedReportId(reportId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedReportId) return;
    try {
      await deleteReport(selectedReportId);
      setReports(reports.filter((r) => r.id !== selectedReportId));
      setShowDeleteModal(false);
      setSelectedReportId(null);
    } catch (err) {
      console.error('Failed to delete report', err);
    }
  };

  const handleView = (report) => {
    navigate(`${ROUTES.REPORTS}/${report.id}`);
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.document_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id?.toString().includes(searchQuery);

    const matchesDiagnostic = diagnosticFilter
      ? report.predicted_diagnostic === diagnosticFilter
      : true;

    const matchesEye = eyeFilter ? report.eye_side === eyeFilter : true;

    const matchesCreator =
      creatorFilter && user?.role === 'admin'
        ? report.created_by?.name
            ?.toLowerCase()
            .includes(creatorFilter.toLowerCase()) ||
          report.created_by?.email
            ?.toLowerCase()
            .includes(creatorFilter.toLowerCase())
        : true;

    return matchesSearch && matchesDiagnostic && matchesEye && matchesCreator;
  });

  const uniqueDiagnostics = [
    ...new Set(reports.map((r) => r.predicted_diagnostic)),
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className='font-sans min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300'
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        className='max-w-7xl mx-auto rounded-2xl shadow-lg overflow-hidden transition-all duration-300 bg-white'
      >
        {/* Header */}
        <div className='bg-very-dark-secondary px-6 py-6'>
          <div className='flex items-center justify-center gap-3'>
            <div className='bg-white p-2 rounded-full shadow-md'>
              <ClipboardPlus className='h-6 w-6 text-very-dark-secondary' />
            </div>
            <h1 className='text-2xl md:text-3xl font-bold text-white'>
              {t('report.historyTitle')}
            </h1>
          </div>
        </div>
        <p className='mt-8 ml-8 flex text-dark-primary text-lg'>
          {user?.role === 'admin'
            ? t('report.historySubtitleAdmin')
            : t('report.historySubtitle')}
        </p>
        {/* Filters and Search - Two Rows */}
        <div className='px-8 mt-4 mb-4 flex flex-col gap-3'>
          {/* Row 1: Filters */}
          <div className='flex flex-col md:flex-row gap-3 items-start md:items-center'>
            {/* Diagnostic Filter */}
            <select
              value={diagnosticFilter}
              onChange={(e) => setDiagnosticFilter(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full md:w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            >
              <option value=''>
                {t('report.filterAllDiagnostics') || 'All Diagnoses'}
              </option>
              {uniqueDiagnostics.map((diagnostic, idx) => (
                <option key={idx} value={diagnostic}>
                  {diagnostic}
                </option>
              ))}
            </select>

            {/* Creator Filter (Only Admin) */}
            {user?.role === 'admin' && (
              <input
                type='text'
                value={creatorFilter}
                onChange={(e) => setCreatorFilter(e.target.value)}
                placeholder={t('report.filterByCreator') || 'Filter by creator'}
                className='border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full md:w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              />
            )}

            {/* Eye Filter */}
            <select
              value={eyeFilter}
              onChange={(e) => setEyeFilter(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full md:w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            >
              <option value=''>
                {t('report.filterAllEyes') || 'All Eyes'}
              </option>
              <option value='OD'>{t('report.eyeRight')}</option>
              <option value='OS'>{t('report.eyeLeft')}</option>
            </select>
          </div>

          {/* Row 2: Search */}
          <div className='w-full'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                t('report.searchPlaceholder') ||
                'Search by patient, ID, or report...'
              }
              className='border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            />
          </div>
        </div>

        {/* REPORT CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8'
        >
          {filteredReports.length > 0 ? (
            filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  ease: 'easeOut',
                  delay: 0.1 + idx * 0.1,
                }}
              >
                <ReportCard
                  report={report}
                  showCreator={user?.role === 'admin'}
                  onView={handleView}
                  onDelete={openDeleteModal}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className='col-span-full text-center text-gray font-medium'
            >
              {t('report.empty')}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={t('report.name')}
      />
    </motion.div>
  );
};

export default Report;
