import React from 'react';
import { useTranslation } from 'react-i18next';

const CancelBtn = ({ onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className='px-5 py-2 text-sm cursor-pointer font-semibold rounded-lg text-dark-gray bg-white border border-dark-gray hover:bg-very-light-gray-hover transition-colors'
    >
      {t('buttons.cancel')}
    </button>
  );
};

export default CancelBtn;
