import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReportHistory, deleteReport } from '../../api/reportService';
import ReportCard from '../../components/ui/reportCard';
import ConfirmDeleteModal from '../../components/ui/confirmDeleteModal'; // 👈 Import
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

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
    <div className='bg-gradient-to-br from-blue-100 to-blue-300 font-sans min-h-screen p-4 md:p-6 lg:p-8 transition-all duration-300'>
      <div className='max-w-7xl mx-auto rounded-2xl shadow-lg overflow-hidden transition-all duration-300 bg-white'>
        <header className='bg-very-dark-secondary p-6 text-white'>
          <h1 className='text-3xl font-bold'>{t('report.historyTitle')}</h1>
          <p className='mt-1 text-light-primary text-lg'>
            {t('report.historySubtitle')}
          </p>
        </header>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8'>
          {reports.length > 0 ? (
            reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={handleView}
                onDelete={openDeleteModal}
              />
            ))
          ) : (
            <div className='col-span-full text-center text-gray font-medium'>
              {t('report.empty')}
            </div>
          )}
        </div>
      </div>

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={t('report.name')}
      />
    </div>
  );
};

export default Report;
