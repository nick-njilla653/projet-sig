import React from 'react';

type AlertProps = {
  children: React.ReactNode;
  className?: string;
};

const Alert: React.FC<AlertProps> = ({ children, className }) => {
  return (
    <div className={`p-4 border-l-4 border-yellow-500 bg-yellow-50 ${className}`}>
      {children}
    </div>
  );
};

type AlertDescriptionProps = {
  children: React.ReactNode;
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return <div className="text-sm">{children}</div>;
};

export { Alert, AlertDescription };