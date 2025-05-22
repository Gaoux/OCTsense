import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReportHistory, deleteReport } from '../../api/reportService';
import ReportCard from '../../components/ui/reportCard';
import ConfirmDeleteModal from '../../components/ui/confirmDeleteModal';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ClipboardPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Report = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      getReportHistory().then(setReports).catch(console.error);
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
    navigate(`/report/${report.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='font-sans min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300'
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
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
          {t('report.historySubtitle')}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8'
        >
          {reports.length > 0 ? (
            reports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 + idx * 0.1 }}
              >
                <ReportCard
                  report={report}
                  onView={handleView}
                  onDelete={openDeleteModal}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
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
