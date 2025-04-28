import React from 'react';

const CancelBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='px-5 py-2 text-sm cursor-pointer font-semibold rounded-lg text-dark-gray bg-white border border-dark-gray hover:bg-very-light-gray-hover  transition-colors'
    >
      Cancel
    </button>
  );
};

export default CancelBtn;
