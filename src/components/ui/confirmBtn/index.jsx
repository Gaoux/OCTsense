import React from 'react';

const ConfirmBtn = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className='px-5 py-2 text-sm cursor-pointer font-semibold rounded-lg text-white bg-secondary border border-primary hover:bg-dark-secondary transition-colors'
    >
      {text}
    </button>
  );
};

export default ConfirmBtn;
