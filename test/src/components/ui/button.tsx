import React from 'react';

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: string;  // Ajout de la propriété variant
  size?: string;     // Ajout de la propriété size
};

const Button: React.FC<ButtonProps> = ({ onClick, children, className, disabled, variant, size }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 ${className} btn-${variant} btn-${size}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
