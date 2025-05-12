import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getReportDetail,
  deleteReport,
  updateReportDetails,
  getReportImage,
} from '../../api/reportService';
import FullImageModal from '../../components/ui/imageModal';
import ReportDetailsInfo from '../../components/ui/reportDetailsInfo';
import ConfirmDeleteModal from '../../components/ui/confirmDeleteModal';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generateReportPDF } from '../../utils/pdfUtils';

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [newPatientName, setNewPatientName] = useState('');
  const [newDocumentId, setNewDocumentId] = useState('');
  const [newEyeSide, setNewEyeSide] = useState('');
  const [newVisualAcuity, setNewVisualAcuity] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(false);
  const [editingPatientInfo, setEditingPatientInfo] = useState(false);

  // Fetch report info
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const fetchedReport = await getReportDetail(id);
        setReport(fetchedReport);
        setNewPatientName(fetchedReport.patient_name || '');
        setNewDocumentId(fetchedReport.document_id || '');
        setNewEyeSide(fetchedReport.eye_side || '');
        setNewVisualAcuity(fetchedReport.visual_acuity || '');
        setNewComment(fetchedReport.comments || '');
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  // Fetch report image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const blob = await getReportImage(id);
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error('Error loading report image:', error);
      }
    };

    if (id) fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  // Delete report
  const handleDelete = async () => {
    try {
      await deleteReport(report.id);
      navigate('/report');
    } catch (error) {
      console.error('Failed to delete report', error);
    }
  };

  // Update report comment
  const handleUpdateReport = async () => {
    try {
      const updatedFields = {
        comments: newComment,
        patient_name: newPatientName,
        document_id: newDocumentId,
        eye_side: newEyeSide,
        visual_acuity: newVisualAcuity,
      };

      await updateReportDetails(report.id, updatedFields);

      setReport({
        ...report,
        ...updatedFields,
      });

      setEditingComment(false);
      setEditingPatientInfo(false);
    } catch (error) {
      console.error('Failed to update report', error);
    }
  };

  // Navigate to previous report
  const handlePrevious = () => {
    console.log('Go to previous report');
    // Later: navigate to previous report by ID if you have the info
  };

  // Navigate to next report
  const handleNext = () => {
    console.log('Go to next report');
    // Later: navigate to next report by ID if you have the info
  };

  // Print the report page
  const handleDownload = () => {
    generateReportPDF(report, imageUrl, t);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-dark-primary text-lg font-semibold'>
          {t('report.loading')}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-dark-secondary font-bold text-4xl'>
          {t('report.notFound')}
        </div>
      </div>
    );
  }

  return (
    <div className='font-sans min-h-screen p-6'>
      <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative'>
        {/* Back Button */}
        <button
          className='flex items-center gap-2 cursor-pointer text-black/60 hover:text-black/70 mb-8 transition-colors'
          onClick={() => navigate('/report')}
        >
          <ArrowLeft className='w-5 h-5' />
          <span className='text-base font-semibold'>Back</span>
        </button>

        {/* Report Info */}
        <ReportDetailsInfo
          report={report}
          editingComment={editingComment}
          newComment={newComment}
          setNewComment={setNewComment}
          setEditingComment={setEditingComment}
          imageUrl={imageUrl}
          onImageClick={() => setShowImageModal(true)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onDelete={() => setShowDeleteModal(true)}
          onDownload={handleDownload}
          newPatientName={newPatientName}
          setNewPatientName={setNewPatientName}
          newDocumentId={newDocumentId}
          setNewDocumentId={setNewDocumentId}
          newEyeSide={newEyeSide}
          setNewEyeSide={setNewEyeSide}
          newVisualAcuity={newVisualAcuity}
          setNewVisualAcuity={setNewVisualAcuity}
          handleUpdateReport={handleUpdateReport}
          editingPatientInfo={editingPatientInfo}
          setEditingPatientInfo={setEditingPatientInfo}
        />
      </div>

      {/* Full Image Modal */}
      {showImageModal && (
        <FullImageModal
          src={imageUrl}
          onClose={() => setShowImageModal(false)}
          onDownloadImage={() => {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `image_${report.id}.jpeg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={t('report.name')}
      />
    </div>
  );
};

export default ReportDetails;
