import React from 'react';
import CancelBtn from '../cancelBtn';

const ImageModal = ({ src, onClose, onDownloadImage }) => {
  if (!src) return null;

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl p-8 shadow-2xl max-w-4xl w-full relative'>
        {/* Full Image */}
        <img
          src={src}
          alt='Full Report View'
          className='w-full max-h-[80vh] object-contain rounded-lg'
        />

        {/* Action Buttons */}
        <div className='flex justify-center gap-6 mt-8'>
          <button
            onClick={onDownloadImage}
            className='cursor-pointer px-6 py-2 text-sm font-semibold rounded-lg bg-secondary hover:bg-dark-secondary text-white transition'
          >
            Download Image
          </button>
          <CancelBtn onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
