import React from 'react';
// import './Button.css';

const LoginButton: React.FC<{ className?: string;}> = ({ className }) => {

  return (
      <div className={className}>
          <button>
              Login
          </button>
      </div>
  );
};

export default LoginButton;