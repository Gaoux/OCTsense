import React, { useState } from 'react';
import {
  Maximize2,
  Pencil,
  Trash2,
  Download,
  Save,
  Calendar,
} from 'lucide-react';
import CancelBtn from '../cancelBtn';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';

const ReportDetailsInfo = ({
  report,
  newComment,
  setNewComment,
  handleUpdateReport,
  imageUrl,
  onImageClick,
  onDownload,
  onDelete,
  newPatientName,
  setNewPatientName,
  newDocumentId,
  setNewDocumentId,
  newEyeSide,
  setNewEyeSide,
  newVisualAcuity,
  setNewVisualAcuity,
  editingComment,
  setEditingComment,
  editingPatientInfo,
  setEditingPatientInfo,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className='rounded-lg bg-white lg:px-4 py-3 transition-all duration-300 shadow-sm'>
      {/* Title + Scan Image */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-light-gray pb-4 gap-4'>
        {/* Left side: Title and metadata */}
        <div className='flex flex-col space-y-2'>
          <h1 className='text-2xl md:text-3xl font-bold text-dark-secondary'>
            {t('report.detailsTitle')}
          </h1>

          <div className='flex flex-wrap items-center gap-2'>
            <span className='px-3 py-0.5 bg-background-secondary text-gray text-sm rounded-full font-medium'>
              ID: {report.id}
            </span>

            <span className='inline-flex items-center gap-1 px-3 py-0.5 bg-background-secondary text-gray text-sm rounded-full font-medium'>
              <Calendar className='w-4 h-4' />
              {report.created_at?.split('T')[0]}
            </span>
          </div>

          {user?.role === 'admin' && report.created_by && (
            <div className='flex flex-col gap-1 mt-2 text-sm text-gray-700'>
              <p className='font-medium'>
                <span className='text-gray-500'>{t('report.createdBy')}:</span>{' '}
                {report.created_by.name}
              </p>
              <p className='text-gray-500'>{report.created_by.email}</p>
            </div>
          )}
        </div>

        {/* Right side: Image Preview */}
        {imageUrl && (
          <div
            className='relative w-36 h-20 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg group hover:scale-105 transition-transform duration-300'
            onClick={onImageClick}
          >
            <img
              src={imageUrl}
              alt='Report Scan Preview'
              className='h-full w-full object-cover transition-transform duration-300'
            />
            <div className='absolute inset-0 bg-very-dark-secondary/20 group-hover:bg-very-dark-secondary/10 transition-all rounded-lg flex items-center justify-center'>
              <Maximize2 className='text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {/* Patient Information Section */}
        <div className='bg-white border border-light-gray p-3 rounded-lg md:col-span-2 shadow-sm transition hover:shadow-md'>
          <h2 className='text-sm uppercase font-medium tracking-wider text-dark-gray mb-2 flex justify-between items-center border-b border-light-gray pb-2'>
            {t('analysis.patient_information')}
            {!editingPatientInfo && (
              <button
                className='text-secondary hover:text-dark-secondary transition flex items-center gap-1 bg-very-light-gray px-2 py-0.5 rounded-md'
                onClick={() => setEditingPatientInfo(true)}
              >
                <Pencil className='w-3 h-3' />
                <span className='text-sm'>{t('buttons.edit')}</span>
              </button>
            )}
          </h2>

          {editingPatientInfo ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-2'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-dark-gray font-medium'>
                  {t('analysis.patient_name')}
                </label>
                <input
                  type='text'
                  className='border border-light-gray p-2 rounded-md text-sm focus:ring-1 focus:ring-secondary focus:border-transparent outline-none transition'
                  placeholder={t('analysis.patient_name')}
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-dark-gray font-medium'>
                  {t('analysis.document_id')}
                </label>
                <input
                  type='text'
                  className='border border-light-gray p-2 rounded-md text-sm focus:ring-1 focus:ring-secondary focus:border-transparent outline-none transition'
                  placeholder={t('analysis.document_id')}
                  value={newDocumentId}
                  onChange={(e) => setNewDocumentId(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-dark-gray font-medium'>
                  {t('analysis.eye_side')}
                </label>
                <select
                  className='border border-light-gray p-2 rounded-md text-sm focus:ring-1 focus:ring-secondary focus:border-transparent outline-none transition bg-white'
                  value={newEyeSide}
                  onChange={(e) => setNewEyeSide(e.target.value)}
                >
                  <option value=''>{t('analysis.select_option')}</option>
                  <option value='OD'>{t('analysis.eye_od')}</option>
                  <option value='OS'>{t('analysis.eye_os')}</option>
                </select>
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-dark-gray font-medium'>
                  {t('analysis.visual_acuity')}
                </label>
                <input
                  type='text'
                  className='border border-light-gray p-2 rounded-md text-sm focus:ring-1 focus:ring-secondary focus:border-transparent outline-none transition'
                  placeholder={t('analysis.visual_acuity')}
                  value={newVisualAcuity}
                  onChange={(e) => setNewVisualAcuity(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <div className='bg-very-light-gray p-2 rounded-md transition hover:bg-very-light-gray-hover'>
                <h3 className='text-sm text-dark-gray font-medium mb-0.5'>
                  {t('analysis.patient_name')}
                </h3>
                <p className='text-very-dark-gray font-medium text-sm'>
                  {report.patient_name || '-'}
                </p>
              </div>
              <div className='bg-very-light-gray p-2 rounded-md transition hover:bg-very-light-gray-hover'>
                <h3 className='text-sm text-dark-gray font-medium mb-0.5'>
                  {t('analysis.document_id')}
                </h3>
                <p className='text-very-dark-gray font-medium text-sm'>
                  {report.document_id || '-'}
                </p>
              </div>
              <div className='bg-very-light-gray p-2 rounded-md transition hover:bg-very-light-gray-hover'>
                <h3 className='text-sm text-dark-gray font-medium mb-0.5'>
                  {t('analysis.eye_side')}
                </h3>
                <p className='text-very-dark-gray font-medium text-sm'>
                  {report.eye_side || '-'}
                </p>
              </div>
              <div className='bg-very-light-gray p-2 rounded-md transition hover:bg-very-light-gray-hover'>
                <h3 className='text-sm text-dark-gray font-medium mb-0.5'>
                  {t('analysis.visual_acuity')}
                </h3>
                <p className='text-very-dark-gray font-medium text-sm'>
                  {report.visual_acuity || '-'}
                </p>
              </div>
            </div>
          )}

          {editingPatientInfo && (
            <div className='flex justify-end gap-2 mt-3 pt-2 border-t border-light-gray'>
              <CancelBtn onClick={() => setEditingPatientInfo(false)} />
              <button
                className='px-3 py-1.5 bg-secondary text-white rounded-md hover:bg-dark-secondary transition flex items-center gap-1'
                onClick={handleUpdateReport}
              >
                <Save className='w-3 h-3' />
                <span className='text-sm'>{t('buttons.save')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Predicted Diagnostic */}
        <div className='bg-background-secondary p-3 rounded-lg border-l-4 border-secondary md:col-span-2 transition hover:bg-light-primary'>
          <h2 className='text-sm uppercase tracking-wider font-semibold text-secondary mb-1'>
            {t('report.predictedDiagnostic')}
          </h2>
          <p className='text-dark-secondary font-bold text-base'>
            {t(`diagnoses.${report.predicted_diagnostic}`)}
          </p>
        </div>

        {/* Diagnostic Probabilities */}
        <div className='bg-very-light-gray p-3 rounded-lg md:col-span-2 transition hover:bg-very-light-gray-hover'>
          <h2 className='text-sm uppercase tracking-wider font-semibold text-dark-gray mb-2 border-b border-light-gray pb-1'>
            {t('report.probabilities')}
          </h2>
          <div className='space-y-2'>
            {report.diagnostic_probabilities &&
              Object.entries(report.diagnostic_probabilities).map(
                ([diagnosis, probability], index) => (
                  <div
                    key={diagnosis}
                    className={
                      index % 2 === 0 ? 'bg-white/20 p-2 rounded-md' : 'p-2'
                    }
                  >
                    <div className='flex justify-between mb-1'>
                      <span className='text-very-dark-gray font-medium text-sm'>
                        {diagnosis}
                      </span>
                      <span className='font-bold text-secondary text-sm'>
                        {(probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className='w-full bg-light-gray rounded-full h-1.5'>
                      <div
                        className='bg-secondary h-1.5 rounded-full transition-all duration-500 ease-in-out'
                        style={{ width: `${(probability * 100).toFixed(1)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        {/* User Comment Section */}
        <div className='bg-white border border-light-gray p-3 rounded-lg md:col-span-2 shadow-sm transition hover:shadow-md'>
          <h2 className='text-sm uppercase font-medium tracking-wider text-dark-gray mb-2 flex justify-between items-center border-b border-light-gray pb-2'>
            {t('report.userComment')}
            {!editingComment && (
              <button
                className='text-secondary hover:text-dark-secondary transition flex items-center gap-1 bg-very-light-gray px-2 py-0.5 rounded-md'
                onClick={() => setEditingComment(true)}
              >
                <Pencil className='w-3 h-3' />
                <span className='text-sm'>{t('buttons.edit')}</span>
              </button>
            )}
          </h2>

          {editingComment ? (
            <div className='flex flex-col gap-2'>
              <textarea
                className='w-full p-2 border border-light-gray rounded-md min-h-[100px] focus:ring-1 focus:ring-secondary focus:border-transparent outline-none transition text-very-dark-gray text-sm'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('report.enterComment')}
              />
            </div>
          ) : (
            <div className='p-2 bg-very-light-gray rounded-md min-h-[80px]'>
              <p className='text-very-dark-gray text-sm'>
                {report.comments || t('report.noComment')}
              </p>
            </div>
          )}
          {editingComment && (
            <div className='flex justify-end gap-2 mt-3 pt-2 border-t border-light-gray'>
              <CancelBtn onClick={() => setEditingComment(false)} />
              <button
                className='px-3 py-1.5 bg-secondary text-white rounded-md hover:bg-dark-secondary transition flex items-center gap-1'
                onClick={handleUpdateReport}
              >
                <Save className='w-3 h-3' />
                <span className='text-sm'>{t('buttons.save')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className='mt-6 flex flex-col md:flex-col gap-3 px-1'>
        {/* Download and Delete centered */}
        <div className='flex justify-center w-full space-x-4'>
          {/* Download Button */}
          <button
            onClick={onDownload}
            className='flex items-center justify-center gap-1 w-36 px-3 py-2 bg-secondary text-white rounded-md hover:bg-dark-secondary transition shadow-sm text-sm'
          >
            <Download className='w-3 h-3' />
            <span className='font-medium'>{t('buttons.download')}</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className='flex items-center justify-center gap-1 w-36 px-3 py-2 bg-delete text-white rounded-md hover:bg-delete-hover transition shadow-sm text-sm'
          >
            <Trash2 className='w-3 h-3' />
            <span className='font-medium'>{t('buttons.delete')}</span>
          </button>
        </div>

        {/* Previous and Next aligned horizontally */}
        {/* <div className='flex justify-between w-full mt-1'>
          <button
            onClick={onPrevious}
            className='flex items-center justify-center gap-1 w-[48%] px-3 py-2 bg-white border border-light-gray rounded-md text-dark-gray hover:bg-very-light-gray transition shadow-sm text-sm'
          >
            <ChevronLeft className='w-3 h-3' />
            <span className='font-medium'>{t('buttons.previous')}</span>
          </button>
          <button
            onClick={onNext}
            className='flex items-center justify-center gap-1 w-[48%] px-3 py-2 bg-white border border-light-gray rounded-md text-dark-gray hover:bg-very-light-gray transition shadow-sm text-sm'
          >
            <span className='font-medium'>{t('buttons.next')}</span>
            <ChevronRight className='w-3 h-3' />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ReportDetailsInfo;
