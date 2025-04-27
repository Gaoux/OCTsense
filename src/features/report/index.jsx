import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReportHistory, deleteReport } from '../../api/reportService';
import ReportCard from '../../components/u-i/reportCard';
import ConfirmDeleteModal from '../../components/u-i/confirmDeleteModal'; // 👈 Import
import { useAuth } from '../../context/AuthContext';

const Report = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

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
    <div className='font-sans min-h-screen p-4 md:p-6 lg:p-8 transition-all duration-300 bg-gradient-to-br from-blue-100 to-blue-300'>
      <div className='max-w-7xl mx-auto rounded-2xl shadow-lg overflow-hidden transition-all duration-300 bg-white'>
        <header className='bg-dark-secondary p-6 text-white'>
          <h1 className='text-3xl font-bold'>Reports History</h1>
          <p className='mt-1 text-light-primary text-lg'>
            View and manage your previous medical reports
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
            <div className='col-span-full text-center text-dark-primary font-medium'>
              No reports available.
            </div>
          )}
        </div>
      </div>

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName='report'
      />
    </div>
  );
};

export default Report;
