import React from 'react';

const AuthLayout = ({ children }) => (
  <div className="layout-container">
    <div className="layout-box">
      {children}
    </div>
  </div>
);

export default AuthLayout;