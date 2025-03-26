import React from 'react';

const Input = ({ placeholder, type = 'text' }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="input"
  />
);

export default Input;