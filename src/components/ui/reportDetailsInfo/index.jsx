import React from 'react';
import { Maximize2, Pencil, Trash2, Download } from 'lucide-react';
import CancelBtn from '../cancelBtn';
import { useTranslation } from 'react-i18next';

const ReportDetailsInfo = ({
  report,
  editingComment,
  newComment,
  setNewComment,
  setEditingComment,
  handleUpdateComment,
  imageUrl,
  onImageClick,
  onPrevious,
  onNext,
  onDownload,
  onDelete,
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

        {/* Predicted Diagnostic */}
        <div className='bg-background-secondary p-4 rounded-md border-l-4 border-secondary md:col-span-2 transition hover:bg-light-primary'>
          <h2 className='text-sm uppercase text-secondary mb-1'>
            {t('report.predictedDiagnostic')}
          </h2>
          <p className='text-dark-secondary font-semibold text-lg'>
            {report.predicted_diagnostic}
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
          <h2 className='text-sm uppercase text-dark-gray mb-3 flex justify-between items-center'>
            {t('report.userComment')}
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
            <div className='flex flex-col gap-4'>
              <textarea
                className='w-full p-3 border border-light-gray rounded-md min-h-[120px] focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className='flex justify-end gap-4'>
                <CancelBtn onClick={() => setEditingComment(false)} />
                <button
                  className='px-4 py-2 bg-secondary text-white rounded-md hover:bg-dark-secondary transition'
                  onClick={handleUpdateComment}
                >
                  {t('buttons.save')}
                </button>
              </div>
            </div>
          ) : (
            <p className='text-very-dark-gray'>
              {report.comments || 'No comment provided.'}
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
