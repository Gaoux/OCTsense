import React, { useState } from 'react';
import { Maximize2, Pencil, Trash2, Download } from 'lucide-react';
import CancelBtn from '../cancelBtn';
import { useTranslation } from 'react-i18next';

const ReportDetailsInfo = ({
  report,
  newComment,
  setNewComment,
  handleUpdateReport,
  imageUrl,
  onImageClick,
  onPrevious,
  onNext,
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
}) => {
  const { t } = useTranslation();

  return (
    <div className='rounded-lg bg-white lg:px-6 transition-all duration-300'>
      {/* Title + Scan Image */}
      <div className='flex justify-between items-start mb-6'>
        <h1 className='text-3xl font-bold text-dark-secondary'>
          {t('report.detailsTitle')}
        </h1>
        {imageUrl && (
          <div
            className='relative w-40 h-24 rounded-md overflow-hidden shadow-md cursor-pointer hover:shadow-lg group hover:scale-105 transition-transform duration-300'
            onClick={onImageClick}
          >
            <img
              src={imageUrl}
              alt='Report Scan Preview'
              className='h-full w-full object-cover transition-transform duration-300'
            />
            <div className='absolute inset-0 bg-very-dark-secondary/20 group-hover:bg-very-dark-secondary/10 transition-all rounded-md flex items-center justify-center'>
              <Maximize2 className='text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Report ID */}
        <div className='bg-very-light-gray p-4 rounded-md transition hover:bg-very-light-gray-hover'>
          <h2 className='text-sm uppercase text-dark-gray mb-1'>
            {t('report.id')}
          </h2>
          <p className='font-mono text-very-dark-gray'>{report.id}</p>
        </div>

        {/* Created At */}
        <div className='bg-very-light-gray p-4 rounded-md transition hover:bg-very-light-gray-hover'>
          <h2 className='text-sm uppercase text-dark-gray mb-1'>
            {t('report.createdAt')}
          </h2>
          <p className='text-very-dark-gray'>
            {report.created_at?.split('T')[0]}
          </p>
        </div>

        {/* Patient Information Section */}
        <div className='bg-white border border-light-gray p-4 rounded-md md:col-span-2 shadow-sm transition hover:shadow-md'>
          <h2 className='text-sm uppercase text-dark-gray mb-3 flex justify-between items-center'>
            {t('analysis.patient_information')}
            {!editingComment && (
              <button
                className='text-secondary hover:text-dark-secondary transition'
                onClick={() => setEditingComment(true)}
              >
                <Pencil className='w-5 h-5' />
              </button>
            )}
          </h2>

          {editingComment ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <input
                type='text'
                className='border border-light-gray p-2 rounded-md text-sm'
                placeholder={t('analysis.patient_name')}
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
              />
              <input
                type='text'
                className='border border-light-gray p-2 rounded-md text-sm'
                placeholder={t('analysis.document_id')}
                value={newDocumentId}
                onChange={(e) => setNewDocumentId(e.target.value)}
              />
              <select
                className='border border-light-gray p-2 rounded-md text-sm'
                value={newEyeSide}
                onChange={(e) => setNewEyeSide(e.target.value)}
              >
                <option value=''>{t('analysis.select_option')}</option>
                <option value='OD'>{t('analysis.eye_od')}</option>
                <option value='OS'>{t('analysis.eye_os')}</option>
              </select>
              <input
                type='text'
                className='border border-light-gray p-2 rounded-md text-sm'
                placeholder={t('analysis.visual_acuity')}
                value={newVisualAcuity}
                onChange={(e) => setNewVisualAcuity(e.target.value)}
              />
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-sm text-dark-gray'>
                  {t('analysis.patient_name')}
                </h3>
                <p className='text-very-dark-gray'>
                  {report.patient_name || '-'}
                </p>
              </div>
              <div>
                <h3 className='text-sm text-dark-gray'>
                  {t('analysis.document_id')}
                </h3>
                <p className='text-very-dark-gray'>
                  {report.document_id || '-'}
                </p>
              </div>
              <div>
                <h3 className='text-sm text-dark-gray'>
                  {t('analysis.eye_side')}
                </h3>
                <p className='text-very-dark-gray'>{report.eye_side || '-'}</p>
              </div>
              <div>
                <h3 className='text-sm text-dark-gray'>
                  {t('analysis.visual_acuity')}
                </h3>
                <p className='text-very-dark-gray'>
                  {report.visual_acuity || '-'}
                </p>
              </div>
            </div>
          )}

          {editingComment && (
            <div className='flex justify-end gap-4 mt-4'>
              <CancelBtn onClick={() => setEditingComment(false)} />
              <button
                className='px-4 py-2 bg-secondary text-white rounded-md hover:bg-dark-secondary transition'
                onClick={handleUpdateReport}
              >
                {t('buttons.save')}
              </button>
            </div>
          )}
        </div>

        {/* Predicted Diagnostic */}
        <div className='bg-background-secondary p-4 rounded-md border-l-4 border-secondary md:col-span-2 transition hover:bg-light-primary'>
          <h2 className='text-sm uppercase text-secondary mb-1'>
            {t('report.predictedDiagnostic')}
          </h2>
          <p className='text-dark-secondary font-semibold text-lg'>
            {t(`diagnoses.${report.predicted_diagnostic}`)}
          </p>
        </div>

        {/* Diagnostic Probabilities */}
        <div className='bg-very-light-gray p-4 rounded-md md:col-span-2 transition hover:bg-very-light-gray-hover'>
          <h2 className='text-sm uppercase text-dark-gray mb-3'>
            {t('report.probabilities')}
          </h2>
          <div className='space-y-3'>
            {report.diagnostic_probabilities &&
              Object.entries(report.diagnostic_probabilities).map(
                ([diagnosis, probability]) => (
                  <div key={diagnosis}>
                    <div className='flex justify-between mb-1'>
                      <span className='text-very-dark-gray'>{diagnosis}</span>
                      <span className='font-semibold text-secondary'>
                        {(probability * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className='w-full bg-light-gray rounded-full h-2'>
                      <div
                        className='bg-secondary h-2 rounded-full'
                        style={{ width: `${(probability * 100).toFixed(2)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        {/* User Comment Section */}
        <div className='bg-white border border-light-gray p-4 rounded-md md:col-span-2 shadow-sm transition hover:shadow-md'>
          <h2 className='text-sm uppercase text-dark-gray mb-3'>
            {t('report.userComment')}
          </h2>

          {editingComment ? (
            <div className='flex flex-col gap-4'>
              <textarea
                className='w-full p-3 border border-light-gray rounded-md min-h-[120px] focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </div>
          ) : (
            <p className='text-very-dark-gray mb-2'>
              {report.comments || t('report.noComment')}
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className='mt-8 flex flex-col md:flex-col gap-6 px-2'>
        {/* Download and Delete centered */}
        <div className='flex justify-center w-full space-x-4'>
          {/* Download Button */}
          <button
            onClick={onDownload}
            className='flex items-center justify-center gap-2 w-40 px-4 py-2 bg-secondary text-white rounded-md hover:bg-light-secondary transition shadow-sm'
          >
            <Download className='w-5 h-5' />
            <span>{t('buttons.download')}</span>
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className='flex items-center justify-center gap-2 w-40 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover transition shadow-sm'
          >
            <Trash2 className='w-5 h-5' />
            <span>{t('buttons.delete')}</span>
          </button>
        </div>

        {/* Previous and Next aligned horizontally */}
        <div className='flex justify-between w-full'>
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            className='flex items-center justify-center gap-2 w-[48%] px-4 py-2 bg-white border border-light-gray rounded-md text-dark-gray hover:bg-very-light-gray transition shadow-sm'
          >
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M15 18l-6-6 6-6' />
            </svg>
            <span>{t('buttons.previous')}</span>
          </button>

          {/* Next Button */}
          <button
            onClick={onNext}
            className='flex items-center justify-center gap-2 w-[48%] px-4 py-2 bg-white border border-light-gray rounded-md text-dark-gray hover:bg-very-light-gray transition shadow-sm'
          >
            <span>{t('buttons.next')}</span>
            <svg
              className='w-5 h-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path d='M9 18l6-6-6-6' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsInfo;
