import React from 'react';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, itemName }) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-dark-gray transform transition-all duration-300 scale-95 animate-fade-in'>
        <h2 className='text-3xl font-bold text-accent text-center mb-6'>
          Confirm Deletion
        </h2>

        <p className='text-center text-dark-gray mb-4 text-lg font-semibold leading-relaxed'>
          Are you sure you want to
          <br />
          delete this <span className='text-black'>{itemName}</span>?
        </p>

        <p className='text-center text-accent opacity-80 mb-8 text-[15px] leading-relaxed'>
          This action is irreversible. Please confirm.
        </p>

        <div className='flex justify-center gap-4'>
          <button
            onClick={onClose}
            className='px-5 py-2 text-sm cursor-pointer font-semibold rounded-lg text-primary bg-very-light-gray border border-primary hover:bg-primary hover:text-white transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-5 py-2 text-sm font-semibold rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors cursor-pointer'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
