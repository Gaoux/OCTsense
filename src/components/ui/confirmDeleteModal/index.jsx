import React from 'react';
import { useTranslation } from 'react-i18next';
import CancelBtn from '../cancelBtn';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, itemName }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-dark-gray transform transition-all duration-300 scale-95 animate-fade-in'>
        <h2 className='text-3xl font-bold text-delete text-center mb-6'>
          {t('deleteModal.title')}
        </h2>

        <p className='text-center text-dark-gray mb-4 text-lg font-semibold leading-relaxed'>
          {t('deleteModal.confirm')} <br />
          <span className='text-black'>{itemName}</span>?
        </p>

        <p className='text-center text-delete opacity-80 mb-8 text-[15px] leading-relaxed'>
          {t('deleteModal.warning')}
        </p>

        <div className='flex justify-center gap-4'>
          <CancelBtn onClick={onClose} />
          <button
            onClick={onConfirm}
            className='px-5 py-2 text-sm font-semibold rounded-lg bg-delete hover:bg-delete-hover text-white transition-colors cursor-pointer'
          >
            {t('buttons.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
