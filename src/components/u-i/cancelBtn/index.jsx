import React from 'react';

const CancelBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='px-5 py-2 text-sm cursor-pointer font-semibold rounded-lg text-primary bg-very-light-gray border border-primary hover:bg-primary hover:text-white transition-colors'
    >
      Cancel
    </button>
  );
};

export default CancelBtn;
