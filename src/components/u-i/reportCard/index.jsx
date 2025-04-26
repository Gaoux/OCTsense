import React from 'react';
import { Trash2 } from 'lucide-react'; // Removed Eye import

const ReportCard = ({ report, onView, onDelete }) => {
  return (
    <div
      className='bg-white border border-light-gray rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group w-full max-w-md mx-auto'
      onClick={() => onView(report)}
    >
      {/* Image Placeholder */}
      <div className='p-6 flex flex-col h-full justify-between'>
        {/* Header: ID and Date */}
        <div className='flex justify-between items-center'>
          <span className='bg-primary text-white text-xs font-bold px-4 py-1 rounded-full w-[130px] truncate text-center uppercase tracking-wide'>
            {report.id}
          </span>
          <span className='text-light-gray text-sm'>
            {report.created_at?.split('T')[0]}
          </span>
        </div>

        {/* Report Info */}
        <div className='mt-5'>
          <h3 className='text-lg font-bold text-dark-gray mb-1'>
            Diagnostic:{' '}
            <span className='text-base text-secondary font-semibold leading-snug'>
              {report.predicted_diagnostic}
            </span>
          </h3>
          {/* // !! Add this line to show pacient name for professional users */}
          {/* <p className='mt-3 text-sm text-dark-gray leading-relaxed w-[160px] truncate'>
            Pacient: {report.comments || 'No user comment provided.'}{' '}
            dfgdgdgfdgdg
          </p> */}
          <p className='mt-3 text-sm text-dark-gray leading-relaxed w-[160px] truncate'>
            {report.comments || 'No user comment provided.'}
          </p>
        </div>
        {/* Action Button */}
        <div className='flex justify-end items-center'>
          <button
            className='text-accent hover:text-accent-hover font-semibold text-base inline-flex items-center gap-2 transition-colors cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              onDelete(report.id);
            }}
          >
            <Trash2 className='w-5 h-5' />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
